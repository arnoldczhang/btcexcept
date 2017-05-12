import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
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
} from 'react-native';
import {
  WhiteSpace
  , Flex
  , WingBlank
  , InputItem
  , NavBar
  , Icon
  , Popover
} from 'antd-mobile';
// import SGListView from 'react-native-sglistview';
import types from '../action-types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee'
  },
  fullScreen: {
    height: '100%',
    width: '100%'
  },
});

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const ListScreen = ({
  showToast
  , updateDataSource

  , ...props
}) => {
  const _this = this;

  _this.props = {
    ...props
  };

  let {token, isMobile} = _this.props;

  $.get(URL.LIST, {sign: JSON.stringify({
    token
    , isMobile
  })}).then((res) => {
    const data = JSON.parse(res._bodyInit);
    // alert(JSON.stringify(data))

    if (data.code != 0) {
      return showToast(data.msg);
    }

    updateDataSource([
      {
        "id": 1234,
        "carPlate": "粤AB349C",
        "imgPath": "",
        "road": {
          "roadId":12,
          "roadName": "广深高速"
        },
        "station": {
          "stationId": 12,
          "stationName": "站名"
        },
        "lane": {
          "netRoadId": 1,
          "lineId": 1,
          "name": "车道1",
          "type": 1
        },
        "uploadTime": "2017-05-03 12:55:23",
        photo: 'http://facebook.github.io/react/img/logo_og.png'
      },
    ]);
    // updateDataSource(data.data.history);
  }).catch((err) => {
    showToast(err.message);
  });

  _this.getDataSource = () => {

    const dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1.uuid !== r2.uuid });
    alert(1)
    const hasData = _this.props.dataSource.length > 0;
    return hasData ? dataSource.cloneWithRows(_this.props.dataSource) : dataSource;
  };

  _this.renderRow = (rowData, sectionID, rowID) => {
    return (
      <View key={sectionID} style={{overflow: 'hidden',backgroundColor: '#fff',marginBottom: 10}}>
        <View style={{flex:2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:40, fontSize:24}}>
          <Text style={{lineHeight:30}}>车牌号：{rowData.carPlate}</Text>
          <Text style={{lineHeight:30}}>{rowData.lane.name + (rowData.lane.type == 1 ? '入口' : '出口')}<Image style={{height: 30, width:30}} source={require('../images/location.jpg')}/></Text>
        </View> 
        <View style={{flex:1, flexDirection: 'row', justifyContent:'center', height: 150, width:'100%'}}>
          <Image style={{height: '100%', width:'100%'}} source={{uri: rowData.photo}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{height:30, lineHeight:30}}>{rowData.uploadTime}</Text>
        </View>                   
      </View> 
    );
  };

  return (<View style={styles.fullScreen, styles.container}>
      <ListView
          dataSource={_this.props.dataSource}
          renderRow={_this.renderRow}
        />
  </View>);
};

ListScreen.navigationOptions = {
  title: '上传记录',
};

ListScreen.propTypes = {
  showToast: PropTypes.func.isRequired,
  updateDataSource: PropTypes.func.isRequired,
};

ListScreen.defaultProps = {
  dataSource: ds.cloneWithRows([])
};

const mapStateToProps = ({login, nav, upload, list}) => ({
  token: login.token,
  dataSource: ds.cloneWithRows(list.dataSource || []),
  isMobile: 1
});

const mapDispatchToProps = dispatch => ({
  showToast: (toastMessage) => dispatch({ type: types.TOAST, payload: toastMessage }),
  updateDataSource: (payload) => dispatch({ type: types.UPDATEDATASOURCE, payload }),
});

export default connect(
  mapStateToProps
  , mapDispatchToProps
)(ListScreen);