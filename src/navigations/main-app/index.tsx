import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import {
  HomeScreen,
  ServePracticeContainer,
  RecordPracticeContainer,
  UploadPracticeContainer,
  TensorFlowCameraContainer,
  TensorCameraContainer,
  CameraContainer,
  UsamaCameraContainer,
  ImagePickerContainer,
  AnalysisScreen,
  VideoPlayerContainer,
  RenderGraphScreen,
} from '../../screens';
const AppStack = createNativeStackNavigator();

function MainAppContainer() {
  return (
    <AppStack.Navigator initialRouteName="HomeScreen" screenOptions={{
      headerShown: false
    }}>
    
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
    name="TensorFlowCameraContainer"
    component={TensorFlowCameraContainer}
    />
    <AppStack.Screen
    name="TensorCameraContainer"
    component={TensorCameraContainer}
    />
    <AppStack.Screen
    name="CameraContainer"
    component={CameraContainer}
    />
    <AppStack.Screen
    name="UsamaCameraContainer"
    component={UsamaCameraContainer}
    />

<AppStack.Screen
    name="ImagePickerContainer"
    component={ImagePickerContainer}
    />

<AppStack.Screen
    name="AnalysisScreen"
    component={AnalysisScreen}
    />

    <AppStack.Screen
    name="VideoPlayerContainer"
    component={VideoPlayerContainer}
    />

    <AppStack.Screen
    name='RenderGraphScreen'
    component={RenderGraphScreen}
    />

    </AppStack.Navigator>
  );
}

export default MainAppContainer;
