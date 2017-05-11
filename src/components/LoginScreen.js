import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import types from '../action-types';
import $ from '../utils';
import URL from '../url';
import {
  StyleSheet
  , Text
  , Button
  , View
  , Image
  , TextInput
  , ToastAndroid
} from 'react-native';
import {
  WhiteSpace
  , Flex
  , WingBlank
  , InputItem
} from 'antd-mobile';
import Notification from '../plugins/notification';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  loginBg: {
    height: '100%',
    width: '100%'
  },
  btn: {
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

const LoginScreen = ({ 
  login
  , loginSuccess
  , loginFail
  , enterInput
  , showToast
  , ...props
}) => {

  const _this = this;
  let isLogin = false;
  _this.props = {
    ...props,
  };

  const goLogin = () => {

    if (isLogin) {
      return;
    }

    isLogin = true;

    let {account, passwd} = _this.props;

    if (!account) {
      showToast('账号不可为空');
    }

    else if (!passwd) {
      showToast('密码不可为空');
    }

    else {
      login(_this.props);
      $.get(URL.LOGIN, {sign: JSON.stringify({
        account,
        passwd
      })}).then((res) => {
        const data = JSON.parse(res._bodyInit);

        //FIXME 测试数据
        // data.data = {
        //   code: 0,
        //   "road": {
        //     "rid": 1342,
        //     "name": "广深高速"
        //   },
        //   "station": {
        //     "sid": 23452,
        //     "name": "大朗收费站"
        //   },
        //   "lanes": [{
        //     "lid": 1,
        //     "type": "2"
        //   }, {
        //     "lid": 2,
        //     "type": "1" // 1代表入口,2代表出口
        //   }, {
        //     "lid": 3,
        //     "type": "2"
        //   }]
        // }
        // alert(JSON.stringify(data))

        if (data.code != 0) {
          showToast(data.msg);
          return loginFail(_this.props);          
        }

        let {road, station, lanes, token} = data.data;

        //FIXME
        lanes = [{
          "netRoadId": 1,
          "roadId": 1,
          "stationId": 1,
          "baseLaneId": 1,
          "name": "车道1",
          "type": 1
        },{
          "netRoadId": 2,
          "roadId": 2,
          "stationId": 2,
          "baseLaneId": 2,
          "name": "车道2",
          "type": 2
        }];

        showToast('登陆成功');
        Object.assign(_this.props, {road, station, lanes, token});
        setTimeout(() => loginSuccess(_this.props), 500);
      }).catch((err) => {
        showToast(err.message);
        loginFail(_this.props);
      });
    }
  };

  const setUserName = (account) => {
    _this.props.account = account;
  };

  const setPassWord = (passwd) => {
    _this.props.passwd = passwd;
  };

  const getWhiteSpace = (num) => {
    num = num < 0 ? 1 : num;
    let 
      arr = Array(num)
      , index = 0
      , length = arr.length
      ;

    while (index < length) {
      arr[index] = <WhiteSpace size="xl" key={index}/>;
      index++;
    }
    return arr;
  };

  return (
    <View style={styles.container}>
      <Image source={require('../images/bg.png')} style={styles.loginBg} >
        {getWhiteSpace(6)}
        <Text style={styles.title}>蓝色通道</Text>
        {getWhiteSpace(2)}
        <InputItem style={{borderBottomWidth: 0}} placeholder="请输入账号"
          value="reportsiteuser"
          onChange={setUserName} />
          <WhiteSpace size="xl" />
          <InputItem style={{borderBottomWidth: 0}} placeholder="请输入密码"
            type="password"
            value="Test@123"
            onChange={setPassWord} />
        {getWhiteSpace(2)}
        <Flex>
          <Flex.Item>
            <WingBlank size="lg">
              <Button onPress={goLogin} 
                style={styles.btn}
                color={this.props.loadWord ==="登陆" ? "rgb(17,148,247)" : "#CCC"}
                title={this.props.loadWord} />
            </WingBlank>
          </Flex.Item>
        </Flex>
        <Notification message={this.props.toastMessage} timeout={1000} />
      </Image>
    </View>
  )
};

LoginScreen.propTypes = {
  login: PropTypes.func.isRequired,
  loginSuccess: PropTypes.func.isRequired,
  enterInput: PropTypes.func.isRequired,
  loginFail: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  loadWord: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  passwd: PropTypes.string.isRequired,
  toastMessage: PropTypes.string.isRequired,
};

LoginScreen.defaultProps = {
  loadWord: '登陆',
  toastMessage: '',
  account: '',
  passwd: '',
};

LoginScreen.navigationOptions = {
  title: '登陆',
  header () {
    visible: false
  }
};

const mapStateToProps = ({ login, nav, upload }) => ({
  isLoggedIn: login.isLoggedIn,
  loadWord: login.loadWord,
  account: login.account,
  passwd: login.passwd,
  toastMessage: login.toastMessage,
});

const mapDispatchToProps = dispatch => ({
  login: (payload) => dispatch({ type: types.LOGINING, payload }),
  enterInput: (obj) => dispatch({ type: types.ENTERINPUT, payload: obj }),
  loginSuccess: (payload) => dispatch({ type: types.LOGINSUCCESS, payload }),
  loginFail: (props) => dispatch({ type: types.LOGINFAIL, props }),
  showToast: (toastMessage) => dispatch({ type: types.TOAST, payload: toastMessage })
});

export default connect(
  mapStateToProps
  , mapDispatchToProps
)(LoginScreen);
