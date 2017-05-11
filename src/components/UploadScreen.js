import React, { PropTypes } from 'react';
import { RadioButtons } from 'react-native-radio-buttons';
import ImagePicker from 'react-native-image-picker';
import $ from '../utils';
import Notification from '../plugins/notification';
import {
  StyleSheet
  , Text
  , Button
  , View
  , Image
  , TextInput
  , ToastAndroid
  , Picker
  , StatusBar
  , ListView
  , ScrollView
  , TouchableWithoutFeedback
  , Dimensions
} from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';
import {
  WhiteSpace
  , Flex
  , WingBlank
  , InputItem
  , NavBar
  , Icon
  , Popover
} from 'antd-mobile';
import { connect } from 'react-redux';
import types from '../action-types';

const Screen = Dimensions.get('window');
const Item = Popover.Item;
const styles = StyleSheet.create({
  container: {
  },
  innerContainer: {
    width: '90%'
  },
  fullScreen: {
    height: Screen.height - 20,
    width: '100%'
  },
  scrollView: {
    backgroundColor: '#FFF',
    height: "50%"
  },
  listItem: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  listItemOut: {
    
  },
  btn: {
  },
  line30: {
    lineHeight: 30
  },
  main: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%', 
  },
  btnOut: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    width: '90%', 
  },
  title: {
    lineHeight:50,
    fontSize: 24,
  },
  mainMiddle: {
    width: '90%',
    height: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#FFF',
    borderRadius: 5
  },
  selectOuter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    height: 300, 
    width: '100%'
  },
  selectImg: {
    height: 150, 
    width: 150,
    alignSelf: 'center',

  },
  input: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%'    
  },
  pic: {
    height: 24,
    width: 24
  },
  header: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

const UploadScreen = ({ 
  logout
  , goList
  , upload
  , uploadSuccess
  , uploadFail
  , uploadImg
  , updatePing
  , showToast

  , ...props 
}) => {
  const _this = this;
  _this.props = {
    ...props
  };

  const choosePic = () => {
    ImagePicker.showImagePicker({
      title: '请选择一张照片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照上传...',
      chooseFromLibraryButtonTitle: '从相册选择…',
      allowsEditing: true,
    }, (res) => {

      if (res.uri) {
        let avatarSource = { uri: res.uri };
        uploadImg({avatarSource, carImage: 'data:image/jpeg;base64,' + res.data});
      }
    });
  };

  const setCarCode = (code) => {
    _this.props.carCode = code;
  };

  const setSelectedOption = (selectedOption) => {
    _this.props.selectedOption = selectedOption;
  };
 
  const renderOption = (option, selected, onSelect, index) => {
    const img = selected 
      ? <Image source={require('../images/gou.jpg')}/>
      : <Image source={require('../images/selectIcon.png')}/>;
 
    return (
      <TouchableWithoutFeedback onPress={onSelect} key={index}>
        <View style={styles.listItem} key={index}>
          {img}
          <Text style={styles.line30}>{option.name}</Text>
          <Text style={styles.line30}>{option.type == 1 ? '入口' : '出口'}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
 
  const renderContainer = (optionNodes) => {
    return <View style={styles.listItemOut}>{optionNodes}</View>;
  }

  const _logout = () => {
    logout(_this.props);
  }

  const _updatePing = (value) => {
    _this.props.shortPing = value;
    updatePing(_this.props);
  }

  const _upload = () => {
    let { token, carImage, shortPing, carCode, selectedOption } = _this.props;
    
    if (!token) {
      showToast('token不存在');
    }

    else if (!carImage) {
      showToast('请选择车辆照片');
    }

    else if (!carCode) {
      showToast('请填写车牌号');
    }

    else if (!selectedOption) {
      showToast('请选择异常路段');
    }

    else {
      let {netRoadId, roadId, stationId, baseLaneId, type} = selectedOption;
      let 
        laneType = type
        , laneId = baseLaneId
        , carPlate = shortPing + carCode
        ;
      upload(_this.props);
      $.get(URL.UPLOAD, {sign: JSON.stringify({
        netRoadId
        , roadId
        , stationId
        , laneType
        , laneId
        , token
        , carPlate
        , carImage
      })}).then((res) => {
        const data = JSON.parse(res._bodyInit);
        // alert(JSON.stringify(data))

        if (data.code != 0) {
          showToast(data.msg);
          return loginFail(_this.props);          
        }

        showToast('上传成功');
        setTimeout(() => uploadSuccess(_this.props), 100);
      }).catch((err) => {
        showToast(err.message);
        uploadFail(_this.props);
      });
    }
  };

  return(
    <View style={styles.container, styles.fullScreen}>
      <Image source={require('../images/bg2.jpg')} style={styles.fullScreen} >
        <View style={styles.main, styles.fullScreen}>
          
          <MenuContext style={{flex:1, marginTop: 10}}>
            <View style={styles.header}>
              <Image style={styles.pic} source={require('../images/touming.png')} />
              <Text style={{height: 30, lineHeight: 30, color: '#FFF', backgroundColor: 'rgba(0,0,0,0)'}}>当前站点</Text>
              
              <Menu onSelect={value => {}} >
                <MenuTrigger>
                  <Image style={styles.pic, {marginTop: 10, marginRight: 10}} source={require('../images/nav_icon_tab_pressed.png')} />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption >
                    <Button
                        title='退出登录'
                        onPress={_logout}
                      />
                  </MenuOption>
                  <MenuOption >
                      <Button
                        title='上传记录'
                        onPress={goList}
                      />
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
            <View>
              <Text style={{height: 30, lineHeight: 30, textAlign: 'center', color: '#FFF', backgroundColor: 'rgba(0,0,0,0)', fontSize: 24}}>{_this.props.road.roadName} - {_this.props.station.stationName}</Text>
            </View>
            
            <View style={styles.mainMiddle}>
                <Image style={styles.pic} source={require('../images/touming.png')} />

                <View style={styles.selectOuter}>
                  <TouchableWithoutFeedback  
                      onPress={choosePic.bind(_this)}>
                    <Image style={styles.selectImg} source={_this.props.avatarSource} />
                  </TouchableWithoutFeedback>
                </View>

                <View style={styles.input}>
                  <Text style={{height: 50, width: 50, lineHeight: 35}} >车牌号 </Text>
                  <Picker
                      style={{width:60}}
                      selectedValue={_this.props.shortPing}
                      onValueChange={(value) => {_updatePing(value)}}>
                      {'京 津 沪 渝 冀 豫 云 辽 黑 湘 皖 鲁 新 苏 浙 赣 鄂 桂 甘 晋 蒙 陕 吉 闽 贵 粤 青 藏 川 宁 琼'.split(/\s+/g).map((el, i) => (<Picker.Item label={el} value={el} key={i} />))}
                    </Picker>
                  <InputItem style={{width: 150, height:50}} 
                      placeholder="请输入车牌号" 
                      onChange={setCarCode}/>
                </View>

                <View style={styles.scrollView} >
                  <ScrollView>
                    <RadioButtons
                        options={ _this.props.lanes }
                        onSelection={ setSelectedOption.bind(this) }
                        selectedOption={_this.props.selectedOption }
                        renderOption={ renderOption }
                        renderContainer={ renderContainer }
                      />
                  </ScrollView>
                </View>

              </View>
          </MenuContext>
          <WhiteSpace size="xl" />
          <View style={styles.btnOut}>
            <Button onPress={_upload} 
                  style={styles.btn}
                  color={this.props.uploadWord ==="上传" ? "rgb(17,148,247)" : "#CCC"}
                  title={this.props.uploadWord} />
          </View>

        </View>

        <Notification message={this.props.toastMessage} timeout={1000} random={this.props.random} />
      </Image>
    </View>
  );
};

UploadScreen.navigationOptions = {
  title: '异常上传',
  headerLeft: (<Image source={require('../images/touming.png')}/>),
  headerRight: (<Image source={require('../images/nav_icon_tab_pressed.png')} />),
  header () {
    visible: false
  }
};


UploadScreen.propTypes = {
  logout: PropTypes.func.isRequired,
  goList: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  uploadSuccess: PropTypes.func.isRequired,
  uploadFail: PropTypes.func.isRequired,
  uploadImg: PropTypes.func.isRequired,
  updatePing: PropTypes.func.isRequired,

  isLoggedIn: PropTypes.bool.isRequired,
  avatarSource: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  passwd: PropTypes.string.isRequired,
  uploadWord: PropTypes.string.isRequired,
  road: PropTypes.object.isRequired, 
  station: PropTypes.object.isRequired,  
  lanes: PropTypes.array.isRequired,  
  token: PropTypes.string.isRequired,  
};

UploadScreen.defaultProps = {
  avatarSource : '',
  shortPing: '沪',
  uploadWord: '上传'
};

const mapStateToProps = ({login, nav, upload}) => ({
  isLoggedIn: login.isLoggedIn,
  avatarSource: upload.avatarSource,
  account: login.account,
  passwd: login.passwd,
  road: login.road,
  station: login.station,
  lanes: login.lanes,
  token: login.token,
  carCode: upload.carCode,
  shortPing: upload.shortPing,
  carImage: upload.carImage,
  toastMessage: login.toastMessage,
  random: login.random,
});

const mapDispatchToProps = dispatch => ({
  logout: (payload) => dispatch({ type: types.LOGOUT, payload }),
  goList: () => dispatch({ type: types.LIST}),
  upload: (payload) => dispatch({ type: types.UPLOAD, payload}),
  uploadSuccess: (payload) => dispatch({ type: types.UPLOADSUCCESS, payload}),
  uploadFail: (payload) => dispatch({ type: types.UPLOADFAIL, payload}),
  uploadImg: (payload) => dispatch({ type: types.UPLOADIMG, payload}),
  updatePing: (payload) => dispatch({ type: types.UPDATEPING, payload}),
  showToast: (toastMessage) => dispatch({ type: types.TOAST, payload: toastMessage }),
});

export default connect(
  mapStateToProps
  , mapDispatchToProps
)(UploadScreen);