// CounterContext.tsx
import React from 'react';

// Declaring the state object globally.
const initialPermissionsState = {
  isCameraPermissions: false,
  isRecordingPermissions: false,
  isGalleryPermissions: false,
};

const permissionsContextWrapper = (component?: React.Component) => ({
  ...initialPermissionsState,
  resetPermissions: () => {
    initialPermissionsState.isCameraPermissions = false;
    initialPermissionsState.isGalleryPermissions = false;
    initialPermissionsState.isRecordingPermissions = false;
    component?.setState({ context: permissionsContextWrapper(component) });
  },
  setCameraPermissions: (isCameraPermissions) => {
    initialPermissionsState.isCameraPermissions
      = isCameraPermissions
    component?.setState({ context: permissionsContextWrapper(component) });
  },
  setGalleryPermissions: (isGalleryPermissions) => {
    initialPermissionsState.isGalleryPermissions
      = isGalleryPermissions
    component?.setState({ context: permissionsContextWrapper(component) });
  },
  setRecordigPermissions: (isRecordingPermissions) => {
    initialPermissionsState.isRecordingPermissions
      = isRecordingPermissions
    component?.setState({ context: permissionsContextWrapper(component) });
  },
});

type Context = ReturnType<typeof permissionsContextWrapper>;

export const CounterContext = React.createContext<Context>(permissionsContextWrapper());

interface State {
  context: Context;
}

export class PermissionsContextProvider extends React.Component {
  state: State = {
    context: permissionsContextWrapper(this),
  };

  render() {
    return (
      <CounterContext.Provider value={this.state.context}>
        {this.props.children}
      </CounterContext.Provider>
    );
  }
}