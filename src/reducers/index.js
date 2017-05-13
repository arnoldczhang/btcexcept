import { combineReducers } from 'redux';
import { NavigationActions as NavAct } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';
import types from '../action-types';

//default screen is `login page`
const router = AppNavigator.router;
const getStateForAction = router.getStateForAction;
const initialAction = router.getActionForPathAndParams('Login');
const initialNavState = getStateForAction(initialAction);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case types.LOGOUT:
      nextState = getStateForAction(NavAct.back(), {...initialNavState});
      break;
    case types.LOGINSUCCESS:
      nextState = getStateForAction(NavAct.navigate({ routeName: 'Upload' }), Object.assign({}, state, action.payload));
      break;
    case types.LIST:
      nextState = getStateForAction(NavAct.navigate({ routeName: 'List' }), Object.assign({}, state, action.payload));
      break;
    default:
      nextState = getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

const initialAuthState = { 
  isLoggedIn: false,
  account: '',
  passwd: '',
  random: ''
  // account: 'reportsiteuser',
  // passwd: 'Test@123'
};

function login (state = initialAuthState, {type, payload}) {
  switch (type) {
    case types.LOGINSUCCESS:
      return { ...state, isLoggedIn: true, ...payload, loadWord: '登陆' };
    case types.LOGINING:
      return { ...state, ...payload, ...{loadWord: '登陆中...'} };
    case types.ENTERINPUT:
      return { ...state, ...payload };
    case types.LOGINFAIL:
      return { ...state, ...payload, ...{loadWord: '登陆'} };
    case types.LOGOUT:
      return { ...initialAuthState, ...{account: payload.account, passwd: payload.passwd} };
    case types.LIST:
      return { ...state, isLoggedIn: true };
    case types.TOAST:
      return {...state, ...{toastMessage: payload, random: Math.random()}};
    default:
      return state;
  }
}

const initialUploadState = { 
  avatarSource : String(require('../images/photo.jpg')),
  shortPing: '沪',
  uploadWord: '上传'
};

function upload (state = initialUploadState, {type, payload}) {
  switch (type) {
    case types.UPLOADIMG:
      let {avatarSource, carImage, carCode, imageName} = payload;
      return {...state, ...{avatarSource, carImage, carCode, imageName}};
    case types.UPDATEPING:
      return {...state, ...{shortPing: payload}};
    case types.LOGOUT:
      return {...initialUploadState};
    case types.SELECTOPT:
      return {...state, ...payload};
    case types.UPLOAD:
      return {...state, ...payload, ...{uploadWord: '上传中...'}};
    case types.UPLOADSUCCESS:
      return {...state, ...{uploadWord: '上传'}};
    case types.UPLOADFAIL:
      return {...state, ...payload, ...{uploadWord: '上传'}};
    default:
      return state;
  }
};

const initialListState = { 
};

function list (state = initialListState, {type, payload}) {
  switch (type) {
    case types.UPDATEDATASOURCE:
      return {...state, ...{dataSource: payload}};
    default:
      return state;
  }
};

const AppReducer = combineReducers({
  nav
  , login
  , upload
  , list
});

export default AppReducer;
