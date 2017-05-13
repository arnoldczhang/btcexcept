'use strict'

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AppReducer from './src/reducers';
import AppWithNavigationState from './src/navigators/AppNavigator';
import SplashScreen from 'react-native-splash-screen';

const btcExceptRecord = () => (
  <Provider store={createStore(AppReducer)}>
    <AppWithNavigationState />
  </Provider>
);

AppRegistry.registerComponent('btcExceptRecord', () => btcExceptRecord);