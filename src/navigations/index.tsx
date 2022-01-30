import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import {
  SplashScreen,
  HomeScreen,
  SigninScreen,
  SignupScreen,
  LandingScreenContainer,
  ResetPasswordContainer,
  PaymentPlanContainer,
  LanguageScreenContainer,
  ServePracticeContainer,
  RecordPracticeContainer,
  UploadPracticeContainer
} from '../screens';
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
      <AppStack.Screen
        name="PaymentPlan"
        component={PaymentPlanContainer}
      />
      <AppStack.Screen
        name="HomeScreen"
        component={HomeScreen}
      />
      <AppStack.Screen
        name="ServePractice"
        component={ServePracticeContainer}
      />
      <AppStack.Screen
        name="RecordPractice"
        component={RecordPracticeContainer}
      />
      <AppStack.Screen
        name="UploadPractice"
        component={UploadPracticeContainer}
      />
      <AppStack.Screen
        name="LanguageScreen"
        component={LanguageScreenContainer}
      />
      
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;
