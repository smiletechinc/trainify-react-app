// CounterContext.tsx
import React from 'react';

// Declaring the state object globally.
const initialAuthState = {
  authObject: null,
  authUser: null,
};

const authContextWrapper = (component?: React.Component) => ({
  ...initialAuthState,
  setAuthUser: newUser => {
    console.log('newUserObject : ', newUser);
    initialAuthState.authUser = newUser;
    component?.setState({context: authContextWrapper(component)});
  },
  setAuthObject: authObject => {
    console.log('newAuthObject : ', authObject);
    initialAuthState.authObject = authObject;
    component?.setState({context: authContextWrapper(component)});
  },
  logoutUser: () => {
    initialAuthState.authUser = null;
    initialAuthState.authObject = null;
    component?.setState({context: authContextWrapper(component)});
  },
});

type Context = ReturnType<typeof authContextWrapper>;

export const AuthContext = React.createContext<Context>(authContextWrapper());

interface State {
  context: Context;
}

export class AuthContextProvider extends React.Component {
  state: State = {
    context: authContextWrapper(this),
  };

  render() {
    return (
      <AuthContext.Provider value={this.state.context}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
