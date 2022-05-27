// CounterContext.tsx
import {string} from '@tensorflow/tfjs-core';
import React from 'react';

/**
 * Permission context state
 */
const initialPermissionsState = {
  isCameraPermissions: false,
  isRecordingPermissions: false,
  isGalleryPermissions: false,
  cameraPermissionsStatus: 'unknown',
};

const permissionsContextWrapper = (component?: React.Component) => ({
  ...initialPermissionsState,
  resetPermissions: () => {
    initialPermissionsState.isCameraPermissions = false;
    initialPermissionsState.isGalleryPermissions = false;
    initialPermissionsState.isRecordingPermissions = false;
    component?.setState({context: permissionsContextWrapper(component)});
  },
  setCameraPermissionsStatus: cameraPermissionsStatus => {
    initialPermissionsState.cameraPermissionsStatus = cameraPermissionsStatus;
    component?.setState({context: permissionsContextWrapper(component)});
  },
  setCameraPermissions: isCameraPermissions => {
    initialPermissionsState.isCameraPermissions = isCameraPermissions;
    component?.setState({context: permissionsContextWrapper(component)});
  },
  setGalleryPermissions: isGalleryPermissions => {
    initialPermissionsState.isGalleryPermissions = isGalleryPermissions;
    component?.setState({context: permissionsContextWrapper(component)});
  },
  setRecordigPermissions: isRecordingPermissions => {
    initialPermissionsState.isRecordingPermissions = isRecordingPermissions;
    component?.setState({context: permissionsContextWrapper(component)});
  },
});

type Context = ReturnType<typeof permissionsContextWrapper>;

/**
 * Permission context component
 */
export const PermissionContext = React.createContext<Context>(
  permissionsContextWrapper(),
);

interface State {
  context: Context;
}

export class PermissionsContextProvider extends React.Component {
  state: State = {
    context: permissionsContextWrapper(this),
  };

  render() {
    return (
      <PermissionContext.Provider value={this.state.context}>
        {this.props.children}
      </PermissionContext.Provider>
    );
  }
}
