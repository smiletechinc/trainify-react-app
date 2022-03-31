import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import {HomeScreen} from '../../screens';
import {TensorCameraContainer, App4} from '../../screens';

import {
  BallPracticeContainer,
  BallPracitceAnalysisGridScreen,
  BallPracticeRenderGraphScreen,
  BallPracticeVideoPlayer,
  UploadBallMachineContainerHook,
} from '../../screens';

import {
  HomePracticeContainer,
  RecordHomePracticeContainer,
  UploadHomePracticeContainer,
  HomePracticeCameraContainer,
  HomePracticeImagePickerContainer,
  HomePracticeVideoPlayerContainer,
  HomePracticeRenderGraphScreen,
  HomePracticeAnalysisGridScreen,
  UploadHomePracticeScreen,
} from '../../screens';

import {
  ServePracticeContainer,
  RecordServePracticeContainer,
  UploadServePracticeContainer,
  ServePracticeCameraContainer,
  ServePracticeImagePickerContainer,
  ServePracticeVideoPlayerContainer,
  ServePracticeRenderGraphScreen,
  ServePracticeAnalysisGridScreen,
  UploadServePracticeScreen,
  UploadServePracticeScreenHook,
} from '../../screens';

const AppStack = createNativeStackNavigator();

function MainAppContainer() {
  return (
    <AppStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <AppStack.Screen name="App4" component={App4} />

      <AppStack.Screen name="HomeScreen" component={HomeScreen} />

      <AppStack.Screen
        name="BallMachinePracticeHomeScreen"
        component={BallPracticeContainer}
      />
      <AppStack.Screen
        name="BallPracitceAnalysisGridScreen"
        component={BallPracitceAnalysisGridScreen}
      />
      <AppStack.Screen
        name="BallPracticeRenderGraphScreen"
        component={BallPracticeRenderGraphScreen}
      />
      <AppStack.Screen
        name="BallPracticeVideoPlayer"
        component={BallPracticeVideoPlayer}
      />
      <AppStack.Screen
        name="HomePracticeHomeScreen"
        component={HomePracticeContainer}
      />
      <AppStack.Screen
        name="UploadHomePracticeScreen"
        component={UploadHomePracticeScreen}
      />
      <AppStack.Screen
        name="HomePracticeAnalysisGridScreen"
        component={HomePracticeAnalysisGridScreen}
      />
      <AppStack.Screen
        name="HomePracticeVideoPlayer"
        component={HomePracticeVideoPlayerContainer}
      />
      <AppStack.Screen
        name="HomePracticeRenderGraphScreen"
        component={HomePracticeRenderGraphScreen}
      />
      <AppStack.Screen
        name="UploadHomePracticeContainer"
        component={UploadHomePracticeContainer}
      />

      <AppStack.Screen
        name="ServePracticeHomeScreen"
        component={ServePracticeContainer}
      />
      <AppStack.Screen
        name="UploadServePracticeScreen"
        component={UploadServePracticeScreen}
      />
      <AppStack.Screen
        name="UploadServePracticeScreenHook"
        component={UploadServePracticeScreenHook}
      />
      <AppStack.Screen
        name="AnalysisGridScreen"
        component={ServePracticeAnalysisGridScreen}
      />
      <AppStack.Screen
        name="VideoPlayerContainer"
        component={ServePracticeVideoPlayerContainer}
      />
      <AppStack.Screen
        name="RenderGraphScreen"
        component={ServePracticeRenderGraphScreen}
      />
      <AppStack.Screen
        name="UploadPractice"
        component={UploadServePracticeContainer}
      />
      <AppStack.Screen
        name="TensorCameraContainer"
        component={TensorCameraContainer}
      />
    </AppStack.Navigator>
  );
}

export default MainAppContainer;
