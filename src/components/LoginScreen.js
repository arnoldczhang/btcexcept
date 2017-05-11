import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import types from '../action-types';
import $ from '../utils';
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
    color: '#FFF'
  }
});

const LoginScreen = ({ 
  login
  , loginSuccess
  , loginFail
  , enterInput
  , ...props
}) => {

  const _this = this;
  _this.props = {
    ...props
  };

  const goLogin = () => {

    if (!_this.props.userName) {
      ToastAndroid.show('账号不可为空', ToastAndroid.SHORT);
    }

    else if (!_this.props.passWord) {
      ToastAndroid.show('密码不可为空', ToastAndroid.SHORT);
    }

    else {
      login();
      $.get(`http://m.lvmama.com/bullet/index.php?s=/AutoRecommended/autoRecommended&pageSize=5&lvversion=7.8.0&page=1&stationId=9&type=HOME&subType=TICKET`)
        .then((res) => {
          ToastAndroid.show('登陆成功', ToastAndroid.SHORT);
          loginSuccess(_this.props);
        }).catch((err) => {
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
          loginFail(_this.props);
        });
    }
  };

  const setUserName = (userName) => {
    enterInput({userName});
  };

  const setPassWord = (passWord) => {
    enterInput({passWord});
  };

  const getWhiteSpace = (num) => {
    num = num < 0 ? 1 : num;
    let 
      arr = Array(num)
      , index = 0
      , length = arr.length
      ;

    while (index < length) {
      arr[index] = <WhiteSpace size="xl" />;
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
          value={this.props.userName}
          onChange={setUserName} />
          <WhiteSpace size="xl" />
          <InputItem style={{borderBottomWidth: 0}} placeholder="请输入密码"
            value={this.props.passWord}
            type="password"
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
      </Image>
    </View>
  )
};

LoginScreen.propTypes = {
  login: PropTypes.func.isRequired,
  loginSuccess: PropTypes.func.isRequired,
  enterInput: PropTypes.func.isRequired,
  loginFail: PropTypes.func.isRequired,
  loadWord: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  passWord: PropTypes.string.isRequired,
};

LoginScreen.defaultProps = {
  loadWord: '登陆',
  userName: '',
  passWord: '',
};

LoginScreen.navigationOptions = {
  title: '登陆',
  header () {
    visible: false
  }
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.isLoggedIn,
  loadWord: state.login.loadWord,
  userName: state.login.userName,
  passWord: state.login.passWord,
});

const mapDispatchToProps = dispatch => ({
  login: () => dispatch({ type: types.LOGINING }),
  enterInput: (obj) => dispatch({ type: types.ENTERINPUT, payload: obj }),
  loginSuccess: (payload) => dispatch({ type: types.LOGINSUCCESS, payload }),
  loginFail: (props) => dispatch({ type: types.LOGINFAIL, props })
});

export default connect(
  mapStateToProps
  , mapDispatchToProps
)(LoginScreen);
