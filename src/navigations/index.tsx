import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import {
  SplashScreen,
  SigninScreen,
  SignupScreen,
  SignupContainer,
  LandingScreenContainer,
  ResetPasswordContainer,
  PaymentPlanContainer,
  TestRecordScreenContainer,
  TestRecordScreenContainerHook,
  UploadBallMachineContainerHook,
  UploadServeContainerHook,
} from '../screens';
import MainAppContainer from './main-app';

const AppStack = createNativeStackNavigator();

function AppContainer() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
        }}>
        <AppStack.Screen name="SplashScreen" component={SplashScreen} />
        <AppStack.Screen name="Signin" component={SigninScreen} />
        <AppStack.Screen name="Signup" component={SignupScreen} />
        <AppStack.Screen name="SignupContainer" component={SignupContainer} />
        <AppStack.Screen
          name="LandingScreen"
          component={LandingScreenContainer}
        />
        <AppStack.Screen
          name="ResetPassword"
          component={ResetPasswordContainer}
        />
        <AppStack.Screen name="PaymentPlan" component={PaymentPlanContainer} />
        <AppStack.Screen name="MainApp" component={MainAppContainer} />

        <AppStack.Screen
          name="TestRecordScreenContainer"
          component={TestRecordScreenContainer}
        />
        <AppStack.Screen
          name="TestRecordScreenContainerHook"
          component={TestRecordScreenContainerHook}
        />
        <AppStack.Screen
          name="UploadServeContainerHook"
          component={UploadServeContainerHook}
        />
        <AppStack.Screen
          name="UploadBallMachineContainerHook"
          component={UploadBallMachineContainerHook}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;
