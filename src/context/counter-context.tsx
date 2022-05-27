// CounterContext.tsx
import React from 'react';


/**
 * Declaring the state object globally for counter.
 */

const initialCounterState = {
  count: 0,
  calibrated: false,
  data: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

const counterContextWrapper = (component?: React.Component) => ({
  ...initialCounterState,
  increment: () => {
    initialCounterState.count += 1;
    component?.setState({ context: counterContextWrapper(component) });
  },
  decrement: () => {
    initialCounterState.count -= 1;
    component?.setState({ context: counterContextWrapper(component) });
  },
  reset: () => {
    initialCounterState.count = 0;
    component?.setState({ context: counterContextWrapper(component) });
  },
  setCalibrated: (isCalibrated) => {
    initialCounterState.calibrated = isCalibrated
    component?.setState({ context: counterContextWrapper(component) });
  },
  setData: (updatedData) => {
    initialCounterState.data = updatedData
    component?.setState({ context: counterContextWrapper(component) });
  }
});

type Context = ReturnType<typeof counterContextWrapper>;


/**
 * Counter context for graph data backup
 */

export const CounterContext = React.createContext<Context>(counterContextWrapper());

interface State {
  context: Context;
}

export class CounterContextProvider extends React.Component {
  state: State = {
    context: counterContextWrapper(this),
  };

  render() {
    return (
      <CounterContext.Provider value={this.state.context}>
        {this.props.children}
      </CounterContext.Provider>
    );
  }
}