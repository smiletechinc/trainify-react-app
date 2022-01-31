import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import { Platform } from 'react-native';
// import { gql, TSFixMe } from '@yi/core'; // 
type TSFixMe = any;
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import React, { Component, createContext } from 'react';
// import { console.log } from '~/common';
import { storage } from './storage';
import { courseProducts, membershipProduct } from './products';

export const IS_IOS = Platform.OS === 'ios';


interface Context extends State {
  requestCoursePurchase: IAPProvider_['requestCoursePurchase'];
  requestMembershipSubscription: IAPProvider_['requestMembershipSubscription'];
}

const initialState = {
  productList: [],
  coursePurchaseInProgress: false,
  requestCoursePurchase: () => {
    throw new Error('IAPContext.Provider missing');
  },
  requestMembershipSubscription: () => {
    throw new Error('IAPContext.Provider missing');
  },
};

export const IAPContext = createContext<Context>(initialState);

const itemSkus =
  Platform.select({
    ios: courseProducts,
    android: [
      ...courseProducts,
      // ...androidStaticTestProducts,
    ],
  }) || [];

const itemSubs =
  Platform.select({
    ios: [membershipProduct],
    android: [membershipProduct],
  }) || [];

let purchaseUpdateSubscription: null | ReturnType<typeof purchaseUpdatedListener> = null;
let purchaseErrorSubscription: null | ReturnType<typeof purchaseErrorListener> = null;

interface State {
  productList: TSFixMe[];
  coursePurchaseInProgress: boolean;
}

type Props = WithApolloClient<{}>;
type PurchaseListener = (p: { transactionId: string }) => void;

class IAPProvider_ extends Component<Props, State> {
  private _isMounted: boolean;
  private _onceFinishMembershipPurchaseListeners: PurchaseListener[];
  private _onceFinishCoursePurchaseListeners: PurchaseListener[];

  constructor(props: Props) {
    super(props);
    this.state = initialState;
    this._isMounted = false;
    this._onceFinishMembershipPurchaseListeners = [];
    this._onceFinishCoursePurchaseListeners = [];
  }

  async componentDidMount() {
    this._isMounted = true;
    try {
      await RNIap.initConnection();
    } catch (err) {
      console.warn(err.code, err.message);
    }

    /* This listener may be called after requesting a purchase, immediately,
     * upon app start up to resolve unfinished purchases, or any time in between.
     *
     * To finish transactions, we need to unlock purchased content for the
     * user on our server, then tell the store to finish/close transaction.
     */
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        if (purchase.productId === membershipProduct) {
          await this.finishMembershipPurchase(purchase);
        } else {
          await this.finishCoursePurchase(purchase);
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(async (error: PurchaseError) => {
      this.safeSetState({ coursePurchaseInProgress: false });

      if (error.code === 'E_USER_CANCELLED') return;

      if (error.code === 'E_ALREADY_OWNED') {
        // @TODO When Android subscriptions fixed:
        // Check if user already has a subscription in owned products
        // If so, retry creating  membership on YI servers
        // const subscriptions = await RNIap.getSubscriptions(itemSubs);
        return;
      }

      console.log(JSON.stringify(error), 'IAP purchaseErrorListener');
    });

    await this.loadProducts();
    await this.loadSubscriptions();

    // @TODO Test if this needs to be called for multiple course purchases of same tier
    // await RNIap.consumeAllItemsAndroid();

    // @TODO check async storage values and try to finalize unfinished purchases?
    // await this.getAvailablePurchases();
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
  }

  safeSetState: IAPProvider_['setState'] = (...args: Parameters<IAPProvider_['setState']>) => {
    if (!this._isMounted) return;
    this.setState(...args);
  };

  async finishCoursePurchase(purchase: InAppPurchase) {
    alert('Finish purchase on backend')
    try {
      // const { transactionId = '', transactionReceipt } = purchase;

      // const lastPurchase = await storage.getLastPurchase();
      // let unfinishedPurchase = await storage.getUnfinishedPurchase(transactionId);

      // // If missing unfinished purchase, attempt to assemble it from lastPurchase
      // if (!unfinishedPurchase && lastPurchase) {
      //   unfinishedPurchase = { ...lastPurchase, transactionId };
      //   await storage.addUnfinishedPurchase(unfinishedPurchase);
      //   await storage.removeLastPurchase();
      // }

      // if (!transactionReceipt || !unfinishedPurchase) return;

      // const { courseId, productId } = unfinishedPurchase;

      // // Store transaction only has generic price tier, not course ID.
      // // Check storage for last attempted course purchase, make sure
      // // generic price tier matches course, then attempt to finish transaction.
      // if (purchase.productId === productId && courseId && this.props.client) {
      //   const variables = {
      //     // Use 100% discount coupon since we've already charged them via store
      //     coupon: 'U7XUyu06wHhL0VtyV0Qd',
      //     unique_entry_ids: [courseId],
      //   };

      //   // Unlock course on YI servers
      //   // const { data } = await this.props.client.mutate<
      //   //   gql.typesClient.Mutate_CartCheckout,
      //   //   gql.typesClient.Mutate_CartCheckoutVariables
      //   // >({ mutation: gql.Mutate_CartCheckout, variables });

      //   // Do not finish transaction if user was not granted course access
      //   // const currentUser = data && data.cartCheckout.current_user;
      //   // const hasCourseAccess = !!(
      //   //   currentUser &&
      //   //   currentUser.purchased_courses &&
      //   //   currentUser.purchased_courses.find(c => c && c.course.id === courseId)
      //   // );

      //   // if (!hasCourseAccess) {
      //   //   throw new Error(`cartCheckout success, but no access for course ${courseId}`);
      //   // }

      //   // Finish store transaction after successful course unlock
      //   const isConsumable = true;
      //   await finishTransaction(purchase, isConsumable);

      //   // Cleanup, run and clear listeners
      //   await storage.removeUnfinishedPurchase(transactionId);
      //   this._onceFinishCoursePurchaseListeners.forEach(cb => cb({ transactionId }));
      //   this._onceFinishCoursePurchaseListeners.length = 0;
      // }
    } catch (e) {
      // @TODO display error to user
      console.log(e, 'IAP error finishing course purchase transaction');
    }
    this.safeSetState({ coursePurchaseInProgress: false });
  }

  async finishMembershipPurchase(purchase: SubscriptionPurchase) {
    alert('finish member purchase');
    try {
      // const { transactionId = '', transactionReceipt } = purchase;

      // // Ensure we only create one membership subscription order per user-triggered event.
      // // This prevents multiple orders being created by subsequent store-triggered transaction events.
      // const canFinish = await storage.getHasUnfinishedMembership();
      // if (!canFinish || !transactionReceipt || !this.props.client) return;

      // const variables = {
      //   platform: IS_IOS ? 'ios' : 'android',
      //   transaction_id: transactionId,
      //   receipt: transactionReceipt,
      // };
      // if (purchase.signatureAndroid) variables.signature = purchase.signatureAndroid;

      // // Grant membership on YI servers
      // const { data } = await this.props.client.mutate<
      //   gql.typesClient.Mutate_CreateMobileSubscription,
      //   gql.typesClient.Mutate_CreateMobileSubscriptionVariables
      // >({
      //   mutation: gql.Mutate_CreateMobileSubscription,
      //   variables,
      // });

      // const createMobileSubscriptionError =
      //   data && data.createMobileSubscription && data.createMobileSubscription.error;

      // if (
      //   !data ||
      //   !data.createMobileSubscription ||
      //   !data.createMobileSubscription.success ||
      //   createMobileSubscriptionError
      // ) {
      //   let errMsg = '';
      //   if (createMobileSubscriptionError) {
      //     errMsg += ` createMobileSubscription error field: ${createMobileSubscriptionError}`;
      //   }
      //   throw new Error(errMsg);
      // }

      // // Check to make sure membership was granted, if not, do not finish transaction
      // const userHasMembership = !!(
      //   data &&
      //   data.createMobileSubscription.current_user &&
      //   data.createMobileSubscription.current_user.membership
      // );
      // if (!userHasMembership) {
      //   throw new Error(`createMobileSubscription success, but membership not granted`);
      // }

      // // Finish store transaction after successful membership grant
      // const isConsumable = false;
      // await finishTransaction(purchase, isConsumable);

      // // Cleanup, run and clear listeners
      // await storage.removeUnfinishedMembership();
      // this._onceFinishMembershipPurchaseListeners.forEach(cb => cb({ transactionId }));
      // this._onceFinishMembershipPurchaseListeners.length = 0;
    } catch (e) {
      // @TODO display error to user
      console.log(e, 'IAP error finishing membership subscription transaction');
    }
    this.safeSetState({ coursePurchaseInProgress: false });
  }

  loadProducts = async () => {
    try {
      const products = await RNIap.getProducts(itemSkus);
      this.safeSetState(({ productList }) => ({ productList: [...productList, ...products] }));
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  loadSubscriptions = async () => {
    try {
      const products = await RNIap.getSubscriptions(itemSubs);
      this.safeSetState(({ productList }) => ({ productList: [...productList, ...products] }));
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  getAvailablePurchases = async () => {
    try {
      // Get all purchases made by the user (either non-consumable, or haven't been consumed yet)
      return RNIap.getAvailablePurchases();
    } catch (err) {
      console.warn(err.code, err.message);
      return null;
    }
  };

  requestCoursePurchase = async (
    productId: string,
    courseId: string,
    onceFinish?: PurchaseListener,
  ) => {
    try {
      this.safeSetState({ coursePurchaseInProgress: true });
      if (onceFinish) this._onceFinishCoursePurchaseListeners.push(onceFinish);
      // Persist courseId to recover from unfinished transactions, and to
      // make available in purchase listener
      await storage.setLastPurchase({ productId, courseId });
      const dangerouslyFinishTransactionAutomatically = false;
      // WARNING: this appears to be a Promise but it never resolves or rejects :'(
      RNIap.requestPurchase(productId, dangerouslyFinishTransactionAutomatically);
    } catch (err) {
      console.log(err);
      console.warn(err.code, err.message);
    }
  };

  requestMembershipSubscription = async (onceFinish?: PurchaseListener) => {
    try {
      this.safeSetState({ coursePurchaseInProgress: true });
      if (onceFinish) this._onceFinishMembershipPurchaseListeners.push(onceFinish);

      // Set flag to permit creation of one mobile membership subscription
      // on YI servers when purchase event is received in purchase listener
      await storage.setHasUnfinishedMembership();

      const dangerouslyFinishTransactionAutomatically = false;
      await RNIap.requestSubscription(membershipProduct, dangerouslyFinishTransactionAutomatically);
    } catch (err) {
      console.log(err);
      console.warn(err.code, err.message);
    }
  };

  render() {
    const { productList, coursePurchaseInProgress } = this.state;
    const stateAndHelpers = {
      productList,
      coursePurchaseInProgress,
      requestCoursePurchase: this.requestCoursePurchase,
      requestMembershipSubscription: this.requestMembershipSubscription,
    };
    return <IAPContext.Provider value={stateAndHelpers}>{this.props.children}</IAPContext.Provider>;
  }
}

export const IAPProvider = withApollo(IAPProvider_);
