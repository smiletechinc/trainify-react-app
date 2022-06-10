/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {store, persistor} from './src/redux/store';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';

const RNRedux = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
