import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import SigninScreen from '../screens/authentication/SigninScreen';
import SignupScreen from '../screens/authentication/SignupScreen';
import LandingScreenContainer from '../screens//authentication/LandingScreen';
import SplashScreen from '../screens/authentication/SplashScreen';
import ResetPasswordContainer from '../screens/authentication/ResetPassword';

const AppStack = createNativeStackNavigator();

function AppContainer() {
  return (
    <NavigationContainer>
      <AppStack.Navigator initialRouteName="SplashScreen" headerMode="none" screenOptions={{
        headerShown: false
      }}>
      <AppStack.Screen name="SplashScreen" component={SplashScreen}/>
      <AppStack.Screen
        name="Signin"
        component={SigninScreen}
      />
      <AppStack.Screen
        name="Signup"
        component={SignupScreen}
      />
      <AppStack.Screen
        name="LandingScreen"
        component={LandingScreenContainer}
      />
      <AppStack.Screen
        name="ResetPassword"
        component={ResetPasswordContainer}
      />
      
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;
