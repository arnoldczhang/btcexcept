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
  // , PickerIOS
  , StatusBar
  , ListView
  , ScrollView
  , TouchableWithoutFeedback
  , Dimensions
  , Platform
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
import PickerIOS from 'react-native-picker';

const Screen = Dimensions.get('window');
const isIOS = Platform.OS == 'ios';
const PINGLIST = '京 津 沪 渝 冀 豫 云 辽 黑 湘 皖 鲁 新 苏 浙 赣 鄂 桂 甘 晋 蒙 陕 吉 闽 贵 粤 青 藏 川 宁 琼'.split(/\s/g);
const Item = Popover.Item;

const styles = StyleSheet.create({
  container: {
  },
  innerContainer: {
    width: '90%'
  },
  fullScreen: {
    height: Screen.height - (isIOS ? 0 : 20),
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
  picMenu: {
    height: 20,
    width: 20,
    marginRight: 10
  },
  header: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text50: {
    width:50,
    height:50,
    lineHeight:50,
    marginBottom: isIOS ? 0 : 15
  },
  text50c: {
    width:50,
    height:50,
    lineHeight:50,
    fontSize:16,
    textAlign: 'right'
  },
  MenuOpt: {
    color:'rgb(17,148,247)', 
    height: 40, 
    lineHeight:30, 
    textAlign:'center'
  }
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
  , selectOption

  , ...props 
}) => {
  let isUpload = false;
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
      quality: 0.5,
      storageOptions: {
        cameraRoll: true
      },
    }, (res) => {

      if (res.uri) {

        if (!/\.jpg$/i.test(res.fileName)) {
          return showToast('上传照片格式必须是jpg');
        }

        if (res.fileSize > 400 * 1024) {
          return showToast('照片过大，请重新选择，不要超过400kb');
        }

        let {carCode} = _this.props;
        let avatarSource = { uri: res.uri };
        // uploadImg({carCode, avatarSource, carImage: 'data:image/jpeg;base64,' + res.data});
        uploadImg({carCode, avatarSource, carImage: res.uri, imageName: res.fileName});
      }
    });
  };

  const setCarCode = (code) => {
    _this.props.carCode = code;
  };

  const setSelectedOption = (selectedOption) => {
    selectOption({selectedOption, carCode: _this.props.carCode});
  };

  const showPick = () => {
    PickerIOS.init({
      pickerData: PINGLIST,
      selectedValue: ['沪'],
      pickerTitleText: '请选择',
      pickerConfirmBtnText: '确认',
      pickerCancelBtnText: '取消',
      onPickerConfirm: data => {
        _updatePing(data);
      },
      onPickerCancel: data => {
        // console.log(data);
      },
      onPickerSelect: data => {
        // console.log(data);
      }
    });
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
    updatePing(value);
  }

  const _upload = () => {

    if (isUpload) {
      return;
    }

    isUpload = true;

    let { token, carImage, imageName, shortPing, carCode, selectedOption } = _this.props;
    
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
  
      let formData = new FormData();
      formData.append('carImage', {uri: carImage, type: 'image/jpg', name: imageName});

      let options = {
        method:'POST',
        headers: {}
      };
      options.headers['Content-Type'] = 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d';
      options.body = formData;

      return fetch(URL.UPLOAD + '?sign=' + encodeURIComponent(JSON.stringify({
        netRoadId
        , roadId
        , stationId
        , laneType
        , laneId
        , token
        , carPlate
      })), options).then((res) => {
         try {
          const data = JSON.parse(res._bodyInit);

          if (data.code != 0) {
            showToast(data.msg);
            isUpload = false;
            return uploadFail(_this.props);
          }

          showToast('上传成功');
          setTimeout(() => uploadSuccess(_this.props), 100);
          isUpload = false;
        } catch (err) {
          alert(err);
        }
      }).catch((err) => {
        showToast(err.message);
        uploadFail(_this.props);
        isUpload = false;
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
              <Text style={{height: 20, lineHeight: 20, color: '#FFF', backgroundColor: 'rgba(0,0,0,0)'}}>当前站点</Text>
              
              <Menu onSelect={value => {}}>
                <MenuTrigger>
                  <Image style={styles.picMenu} source={require('../images/nav_icon_tab_pressed.png')} />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={value => {_logout()}}>
                    <Text style={styles.MenuOpt}>退出登录</Text>
                  </MenuOption>
                  <MenuOption onSelect={value => {goList()}}>
                    <Text style={styles.MenuOpt}>上传记录</Text>
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
                  <Text style={styles.text50} >车牌号 </Text>
                  {
                    isIOS ? (<Text 
                      style={styles.text50c}
                      onPress={showPick}>{_this.props.shortPing} </Text>)
                      : (
                        <Picker
                          style={{width:60}}
                          selectedValue={_this.props.shortPing}
                          onValueChange={(value) => {_updatePing(value)}}>
                          {PINGLIST.map((el, i) => (<Picker.Item label={el} value={el} key={i} />))}
                        </Picker>                              
                      )
                  }
                  <InputItem style={{width: 150, height:50, lineHeight:50, borderBottomWidth:0}} 
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
  selectOption: PropTypes.func.isRequired,

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
  road: login.road || {},
  station: login.station || {},
  lanes: login.lanes || [],
  token: login.token,
  carCode: upload.carCode,
  shortPing: upload.shortPing,
  carImage: upload.carImage,
  selectedOption: upload.selectedOption,
  toastMessage: login.toastMessage,
  random: login.random,
});

const mapDispatchToProps = dispatch => ({
  logout: (payload) => dispatch({ type: types.LOGOUT, payload }),
  goList: () => dispatch({ type: types.LIST}),
  selectOption: (payload) => dispatch({ type: types.SELECTOPT, payload}),
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