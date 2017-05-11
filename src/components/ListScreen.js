import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
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
import SGListView from 'react-native-sglistview';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee'
  },
  fullScreen: {
    height: '100%',
    width: '100%'
  },
});

const ListScreen = ({...props}) => {
  const _this = this;

  _this.props = {
    ...props,
    dataSource: [
      {
        code: '沪A1234',
        enter: '车道（入口）',
        date: '2017.5.3',
        photo: 'http://facebook.github.io/react/img/logo_og.png'
      },
      {
        code: '沪A1234',
        enter: '车道（入口）',
        date: '2017.5.3',
        photo: 'http://facebook.github.io/react/img/logo_og.png'
      },
      {
        code: '沪A1234',
        enter: '车道（入口）',
        date: '2017.5.3',
        photo: 'http://facebook.github.io/react/img/logo_og.png'
      },
      {
        code: '沪A1234',
        enter: '车道（入口）',
        date: '2017.5.3',
        photo: 'http://facebook.github.io/react/img/logo_og.png'
      },
      {
        code: '沪A1234',
        enter: '车道（入口）',
        date: '2017.5.3',
        photo: 'http://facebook.github.io/react/img/logo_og.png'
      },
    ]
  };

  _this.attachEnd = () => {

  };

  _this.getDataSource = () => {

    const dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1.uuid !== r2.uuid });

    const hasData = _this.props.dataSource.length > 0;
    return hasData ? dataSource.cloneWithRows(_this.props.dataSource) : dataSource;
  };

  _this.renderRow = (rowData, sectionID, rowID) => {
    return (
      <View key={sectionID} style={{overflow: 'hidden',backgroundColor: '#fff',marginBottom: 10}}>
        <View style={{flex:2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:50, lineHeight:50, fontSize:24}}>
          <Text>车牌号：{rowData.code}</Text>
          <Text>{rowData.enter}<Image style={{height: 40, width:40}} source={require('../images/location.jpg')}/></Text>
        </View> 
        <View style={{flex:1, flexDirection: 'row', justifyContent:'center', height: 150, width:'100%'}}>
          <Image style={{height: '100%', width:'100%'}} source={{uri: rowData.photo}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{height:30, lineHeight:30}}>{rowData.date}</Text>
        </View>                   
      </View> 
    );
  };

  return (<View style={styles.fullScreen, styles.container}>
      <SGListView
          dataSource={_this.getDataSource()}
          renderRow={_this.renderRow}
          onEndReached={_this.attachEnd}
        />
  </View>);
};

ListScreen.navigationOptions = {
  title: '上传记录',
};

export default ListScreen;
