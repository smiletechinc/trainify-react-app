// CounterContext.tsx
import {string} from '@tensorflow/tfjs-core';
import React from 'react';

// Declaring the state object globally.
const initalSubscriptionState = {
  subscriptionPlan: 1,
  subscriptionStatus: 'Undetermined',
  animationVisible: false,
  validProduct: true,
};

const useSubscriptionContext = (component?: React.Component) => ({
  ...initalSubscriptionState,
  setSubscriptionPlan: (planValue: number) => {
    console.log('subscriptionPlan update in context', planValue);
    initalSubscriptionState.subscriptionPlan = planValue;
    component?.setState({context: useSubscriptionContext(component)});
  },
  setSubscriptionStatus: (statusValue: string) => {
    console.log('subscriptionstatus update in context', statusValue);
    initalSubscriptionState.subscriptionStatus = statusValue;
    component?.setState({context: useSubscriptionContext(component)});
  },
  setAnimationVisible: (visibleCheck: boolean) => {
    console.log('subscriptionanimation update in context', visibleCheck);
    initalSubscriptionState.animationVisible = visibleCheck;
    component?.setState({context: useSubscriptionContext(component)});
  },
  setValidProduct: (validProductCheck: boolean) => {
    console.log('subscription visible check in context', validProductCheck);
    initalSubscriptionState.validProduct = validProductCheck;
    component?.setState({context: useSubscriptionContext(component)});
  },
});

type Context = ReturnType<typeof useSubscriptionContext>;

export const SubscriptionContext = React.createContext<Context>(
  useSubscriptionContext(),
);

interface State {
  context: Context;
}

export class SubscriptionContextProvider extends React.Component {
  state: State = {
    context: useSubscriptionContext(this),
  };

  render() {
    return (
      <SubscriptionContext.Provider value={this.state.context}>
        {this.props.children}
      </SubscriptionContext.Provider>
    );
  }
}
