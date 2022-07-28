// CounterContext.tsx
import {string} from '@tensorflow/tfjs-core';
import React from 'react';

// Declaring the state object globally.
const initalSettingState = {
  isTermCheck: false,
  isPrivacyCheck: false,
};

const useSettingContextWraper = (component?: React.Component) => ({
  ...initalSettingState,
  setTermCheck: () => {
    initalSettingState.isTermCheck = true;
    component?.setState({context: useSettingContextWraper(component)});
  },
  setPrivacyCheck: () => {
    initalSettingState.isPrivacyCheck = true;
    component?.setState({context: useSettingContextWraper(component)});
  },
  // setCameraPermissionsStatus: cameraPermissionsStatus => {
  //   initalSettingState.cameraPermissionsStatus = cameraPermissionsStatus;
  //   component?.setState({context: useSettingContextWraper(component)});
  // },
  // setCameraPermissions: isCameraPermissions => {
  //   initalSettingState.isCameraPermissions = isCameraPermissions;
  //   component?.setState({context: useSettingContextWraper(component)});
  // },
  // setGalleryPermissions: isGalleryPermissions => {
  //   initalSettingState.isGalleryPermissions = isGalleryPermissions;
  //   component?.setState({context: useSettingContextWraper(component)});
  // },
  // setRecordigPermissions: isRecordingPermissions => {
  //   initalSettingState.isRecordingPermissions = isRecordingPermissions;
  //   component?.setState({context: useSettingContextWraper(component)});
  // },
});

type Context = ReturnType<typeof useSettingContextWraper>;

export const SettingContext = React.createContext<Context>(
  useSettingContextWraper(),
);

interface State {
  context: Context;
}

export class SettingContextProvider extends React.Component {
  state: State = {
    context: useSettingContextWraper(this),
  };

  render() {
    return (
      <SettingContext.Provider value={this.state.context}>
        {this.props.children}
      </SettingContext.Provider>
    );
  }
}
