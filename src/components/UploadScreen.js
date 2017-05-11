import React, { PropTypes } from 'react';
import { RadioButtons } from 'react-native-radio-buttons';
import ImagePicker from 'react-native-image-picker';
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

const Item = Popover.Item;
const styles = StyleSheet.create({
  container: {
  },
  innerContainer: {
    width: '90%'
  },
  fullScreen: {
    height: '100%',
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
    fontSize: 36
  },
  line30: {
    lineHeight: 30
  },
  main: {
    marginLeft: 'auto',
    marginRight: 'auto',
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

const UploadScreen = ({ logout, goList, upload, uploadImg, ...props }) => {
  const _this = this;

  _this.state = {
    language: ''
  };

  _this.props = {
    ...props,
    dataSource: [
      {
        road: '车道1',
        type: '入口'
      },
      {
        road: '车道2',
        type: '入口'
      },
      {
        road: '车道3',
        type: '出口'
      },
      {
        road: '车道4',
        type: '出口'
      },
      {
        road: '车道2',
        type: '入口'
      },
      {
        road: '车道3',
        type: '出口'
      },
      {
        road: '车道4',
        type: '出口'
      }
    ],
    shortPing: '沪'
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
        uploadImg({avatarSource});
      }
    });
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
        <View style={styles.listItem}>
          {img}
          <Text style={styles.line30}>{option.road}</Text>
          <Text style={styles.line30}>{option.type}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
 
  const renderContainer = (optionNodes) => {
    return <View style={styles.listItemOut}>{optionNodes}</View>;
  }

  return(
    <View style={styles.container, styles.fullScreen}>
      <Image source={require('../images/bg2.jpg')} style={styles.fullScreen} >
        <View style={styles.main, styles.fullScreen}>
          
          <MenuContext style={{flex:1}}>
            <View style={styles.header}>
              <Image style={styles.pic} source={require('../images/touming.png')} />
              <Text style={{height: 30, lineHeight: 30, color: '#FFF'}}>当前站点{_this.props.userName}</Text>
              
              <Menu onSelect={value => alert(`Selected number: ${value}`)} >
                <MenuTrigger>
                  <Image style={styles.pic, {marginTop: 10, marginRight: 10}} source={require('../images/nav_icon_tab_pressed.png')} />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={logout}>
                    <Button
                        title='退出登录'
                        onPress={logout}
                      />
                  </MenuOption>
                  <MenuOption onSelect={goList}>
                      <Button
                        title='上传记录'
                        onPress={goList}
                      />
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
            <View>
              <Text style={{height: 30, lineHeight: 30, textAlign: 'center', color: '#FFF', fontSize: 24}}>广东佛山 - 龙门收费站</Text>
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
                      onValueChange={(value) => this.setState({language: value})}>
                      {'京 津 沪 渝 冀 豫 云 辽 黑 湘 皖 鲁 新 苏 浙 赣 鄂 桂 甘 晋 蒙 陕 吉 闽 贵 粤 青 藏 川 宁 琼'.split(/\s+/g).map((el) => (<Picker.Item label={el} value={el} />))}
                    </Picker>
                  <InputItem style={{width: 150, height:50}} placeholder="请输入车牌号" />
                </View>

                <View style={styles.scrollView} >
                  <ScrollView>
                    <RadioButtons
                        options={ _this.props.dataSource }
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
          <View style={styles.main}>
            <Button onPress={upload} 
                  style={styles.btn, {fontSize: 30}}
                  color="#CCC"
                  title="上传" />
          </View>

        </View>
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
  isLoggedIn: PropTypes.bool.isRequired,
  avatarSource: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  goList: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  uploadImg: PropTypes.func.isRequired,
};

UploadScreen.defaultProps = {
  avatarSource : require('../images/photo.jpg')
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.isLoggedIn,
  userName: state.nav.userName,
  avatarSource: state.upload.avatarSource
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: types.LOGOUT }),
  goList: () => dispatch({ type: types.LIST}),
  upload: () => dispatch({ type: types.UPLOAD}),
  uploadImg: (payload) => dispatch({ type: types.UPLOADIMG, payload})
});

export default connect(
  mapStateToProps
  , mapDispatchToProps
)(UploadScreen);