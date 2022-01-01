import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import AuthenticationScreen from '../screens/authentication';
import LandingScreenContainer from '../screens//authentication/LandingScreen';
import SplashScreen from '../screens/authentication/SplashScreen';

const AppStack = createNativeStackNavigator();

function AppContainer() {
  return (
    <NavigationContainer>
      <AppStack.Navigator initialRouteName="SplashScreen" headerMode="none" screenOptions={{
        headerShown: false
      }}>
      <AppStack.Screen name="SplashScreen" component={SplashScreen}/>
      <AppStack.Screen
        name="Authentication"
        component={AuthenticationScreen}
      />
      <AppStack.Screen
        name="LandingScreen"
        component={LandingScreenContainer}
      />
      
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;
