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
  ServePracticeContainer,
  ServePracticeVideoPlayerContainer,
  ServePracticeRenderGraphScreen,
  ServePracticeAnalysisGridScreen,
} from '../../screens';

const AppStack = createNativeStackNavigator();

function MainAppContainer() {
  return (
    <AppStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false, orientation: 'portrait'}}>
      <AppStack.Screen name="App4" component={App4} />

      <AppStack.Screen name="HomeScreen" component={HomeScreen} />

      <AppStack.Screen
        name="BallMachinePracticeHomeScreen"
        component={BallPracticeContainer}
        options={{orientation: 'landscape'}}
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
        name="ServePracticeHomeScreen"
        component={ServePracticeContainer}
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
        name="TensorCameraContainer"
        component={TensorCameraContainer}
        options={{orientation: 'landscape'}}
      />
    </AppStack.Navigator>
  );
}

export default MainAppContainer;
