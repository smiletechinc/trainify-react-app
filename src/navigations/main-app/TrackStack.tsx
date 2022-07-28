import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import {
  SplashScreen,
  SigninScreen,
  SignupScreen,
  LandingScreenContainer,
  ResetPasswordContainer,
  PaymentPlanContainer,
} from '../../screens';
const AppStack = createNativeStackNavigator();

function TrackStackContainer() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        initialRouteName="SplashScreen"
        headerMode="none"
        screenOptions={{
          headerShown: false,
        }}>
        <AppStack.Screen name="SplashScreen" component={SplashScreen} />
        <AppStack.Screen name="Signin" component={SigninScreen} />
        <AppStack.Screen name="Signup" component={SignupScreen} />
        <AppStack.Screen
          name="LandingScreen"
          component={LandingScreenContainer}
        />
        <AppStack.Screen
          name="ResetPassword"
          component={ResetPasswordContainer}
        />
        <AppStack.Screen name="PaymentPlan" component={PaymentPlanContainer} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default TrackStackContainer;
