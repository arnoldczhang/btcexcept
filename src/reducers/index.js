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
      nextState = getStateForAction(NavAct.back(), state);
      break;
    case types.LOGINSUCCESS:
      nextState = getStateForAction(NavAct.navigate({ routeName: 'Upload' }), Object.assign({}, state, action.payload));
      break;
    case types.LIST:
      nextState = getStateForAction(NavAct.navigate({ routeName: 'List' }), state);
      break;
    default:
      nextState = getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

function login (state = initialAuthState, {type, payload}) {
  switch (type) {
    case types.LOGINSUCCESS:
      return { ...state, isLoggedIn: true, loadWord: '登陆' };
    case types.LOGINING:
      return { ...state, loadWord: '登陆中...' };
    case types.ENTERINPUT:
      return { ...state, loadWord: '登陆', ...payload};
    case types.LOGINFAIL:
      return { ...state, loadWord: '登陆' };
    case types.LOGOUT:
      return { ...state, isLoggedIn: false };
    case types.LIST:
      return { ...state, isLoggedIn: true };
    default:
      return state;
  }
}

const initialUploadState = { avatarSource : require('../images/photo.jpg') };

function upload (state = initialUploadState, {type, payload}) {
  switch (type) {
    case types.UPLOADIMG:
      return {...state, ...payload};
    default:
      return state;
  }
};

const AppReducer = combineReducers({
  nav,
  login,
  upload
});

export default AppReducer;
