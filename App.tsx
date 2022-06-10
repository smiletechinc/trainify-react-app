/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AppContainer from './src/navigations';
import {AuthContextProvider} from './src/context/auth-context';
import {CounterContextProvider} from './src/context/counter-context';
import {PermissionsContextProvider} from './src/context/permissions-context';
// import {store} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

const App: () => Node = () => {
  useKeepAwake();
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <AuthContextProvider>
      <CounterContextProvider>
        <PermissionsContextProvider>
          <AppContainer />
        </PermissionsContextProvider>
      </CounterContextProvider>
    </AuthContextProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
