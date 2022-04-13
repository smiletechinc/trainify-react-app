import React, {FunctionComponent, useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  Platform,
  Alert,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// const PaymentRequest = require('react-native-payments').PaymentRequest;

// Custom UI components.
import {COLORS, SCREEN_WIDTH} from '../../constants';
import {TextInput} from '../../global-components/input';
import SignupFooterComponent from './components/SignupFooterComponent';
import AppUserItem from './components/AppUserItem';
import SubscriptionItem from './components/SubscriptionItem';
import {
  signUpService,
  signInService,
  registerUserService,
} from './../../services/authenticationServices';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';
import {SimpleButton} from '../../global-components/button';
import {trainProducts, membershipProduct} from './products';

const signupMainImage = require('../../assets/images/small-logo.png');
const backIcon = require('../../assets/images/back-icon.png');

import RNIap, {
  InAppPurchase,
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
} from 'react-native-iap';
import {UserObject} from '../../types';

const itemSkus =
  Platform.select({
    ios: trainProducts,
    android: [
      ...trainProducts,
      // ...androidStaticTestProducts,
    ],
  }) || [];

const itemSubs =
  Platform.select({
    ios: [membershipProduct],
    android: [membershipProduct],
  }) || [];

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

type Props = {
  route: any;
  navigation: any;
};

const PaymentPlanContainer: FunctionComponent<Props> = props => {
  const {route, navigation} = props;
  const {authObject, signupObject} = route.params;
  const [playerSelected, setPlayerSelected] = useState<number>(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState<number>(-1);
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [coursePurchaseInProgress, setCoursePurchaseInProgress] =
    useState(false);

  useEffect(() => {
    proceedForApplePay();
    return () => {
      removeApplePay();
    };
  }, []);

  async function proceedForApplePay() {
    getItems();
    try {
      const result = await RNIap.initConnection();
      console.log('connection is => ', result);
    } catch (err) {
      console.log('error in cdm => ', err);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        console.log('purchase');
        if (purchase.productId === membershipProduct) {
          console.log('purchase.productId', purchase.productId);
        } else {
          console.log('finish purchase.productId', purchase.productId);
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      async (error: PurchaseError) => {
        setCoursePurchaseInProgress(false);

        if (error.code === 'E_USER_CANCELLED') return;

        if (error.code === 'E_ALREADY_OWNED') {
          return;
        }

        alert(
          `Subscription Purchase Error, ${JSON.stringify(
            error,
          )}, IAP purchaseErrorListener`,
        );
      },
    );
  }

  async function removeApplePay() {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
  }

  async function getItems() {
    try {
      const products: Product[] = await RNIap.getProducts(itemSkus);
      console.log('Products', products);
      setProductList(products);
    } catch (err) {
      console.log('getItems || purchase error => ', err);
    }
  }

  async function getSubscriptions() {
    try {
      const products = await RNIap.getSubscriptions(itemSubs);
      console.log('Products => ', products);
      setProductList(products);
    } catch (err) {
      console.log('getSubscriptions error => ', err);
    }
  }
  4;
  async function getAvailablePurchases() {
    try {
      console.log('before.');
      const purchases = await RNIap.getAvailablePurchases();
      console.log('after.');
      if (purchases && purchases.length > 0) {
        console.info('Available purchases => ', purchases);
        this.setState({
          availableItemsMessage: `Got ${purchases.length} items.`,
          receipt: purchases[0].transactionReceipt,
        });
      } else {
        console.log('No available purchases');
      }
    } catch (err) {
      console.warn(err.code, err.message);
      console.log('getAvailablePurchases error => ', err);
    }
  }

  async function requestPurchase(sku, onSuccess: () => void) {
    console.log('sku', sku);
    try {
      const dangerouslyFinishTransactionAutomatically = false;
      RNIap.requestPurchase(
        sku,
        dangerouslyFinishTransactionAutomatically,
      ).then(res => {
        console.log(`Purchase success, ${res}`);
      });
    } catch (err) {
      alert(`requestPurchase error => , ${err}`);
    }
  }

  async function requestSubscription(sku) {
    try {
      RNIap.requestSubscription(sku);
    } catch (err) {
      alert(`request Subscription failed =>, ${err.toLocaleString()}`);
    }
  }

  const onSuccess = () => {
    console.log('successfully puchased');
  };

  function proceedToPurchase() {
    requestSubscription(trainProducts[subscriptionPlan]);
  }

  const proceedToRegister = user => {
    const id = user.uid;
    const userObject: UserObject = {...signupObject, id: user.uid};
    registerUserService(userObject, registrationSuccess, registrationFailure);
  };

  const goToSigninPage = () => {
    navigation.replace('Signin');
  };

  const registrationSuccess = (userCredential?: any) => {
    Alert.alert('Trainify', `You've signed up successfully.`);
    goToSigninPage();
  };

  const registrationFailure = error => {
    if (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert('Trainify', errorMessage);
    } else {
      Alert.alert('Trainify', 'Error in user registration!');
    }
  };

  const signupSuccess = (user?: any) => {
    if (user) {
      proceedToRegister(user);
    }
  };

  const signupFailure = error => {
    if (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === 'auth/email-already-in-use') {
        Alert.alert('Signup error', 'User already exists!');
      } else {
        console.log('signup error: ', errorMessage);
        Alert.alert('Signup error', 'Please enter a valid email and password');
      }
    } else {
      console.log('signup error: ', 'Unknown');
      Alert.alert('Signup error', 'Error in signup!');
    }
  };

  const proceedToSignup = () => {
    signUpService(authObject, signupSuccess, signupFailure);
  };

  return (
    <View style={styles.login_main_container}>
      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: 55,
        }}>
        <View style={{paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <TouchableOpacity
            style={styles.login_back_icon}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={backIcon} style={{width: 24, height: 24}} />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 47, paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <View style={{alignItems: 'center'}}>
            <AutoHeightImage source={signupMainImage} width={163} />
          </View>
          <View>
            <Text
              style={[
                globalStyles.h1,
                {
                  color: COLORS.dark_black,
                  marginTop: 16,
                  lineHeight: 30,
                  fontWeight: '600',
                },
              ]}>
              WHO’S USING THE APP?
            </Text>
            <AppUserItem
              leftText="Coach"
              onPress={() => {
                setPlayerSelected(0);
              }}
              isSelected={playerSelected === 0 ? true : false}
            />
            <AppUserItem
              leftText="Player Self Tracking"
              onPress={() => {
                setPlayerSelected(1);
              }}
              isSelected={playerSelected === 1 ? true : false}
            />
            <AppUserItem
              leftText="Parent for Child Tracking"
              onPress={() => {
                setPlayerSelected(2);
              }}
              isSelected={playerSelected === 2 ? true : false}
            />
          </View>
          <View>
            <Text
              style={[
                globalStyles.h1,
                {
                  color: COLORS.dark_black,
                  marginTop: 47,
                  lineHeight: 30,
                  fontWeight: '600',
                },
              ]}>
              SUBSCRIPTION TIERS
            </Text>

            {/* <SubscriptionItem
              leftText="Free"
              price="0 PKR"
              isSelected = {subscriptionPlan === 0 ? true : false}
              onPress={() => {
                setSubscriptionPlan(0);
                requestPurchase(trainProducts[0], onSuccess);
                proceedToPurchase();
              }}
            /> */}

            <SubscriptionItem
              leftText="Basic"
              rightText="Serve Practice Only"
              price="Free"
              isSelected={subscriptionPlan === 1 ? true : false}
              onPress={() => {
                setSubscriptionPlan(1);
                requestPurchase(trainProducts[1], onSuccess);
                // proceedToPurchase();
              }}
            />
            <SubscriptionItem
              leftText="Silver"
              rightText="Serve Practice/Practice with Ball Machine"
              price="$74.99/yr"
              isSelected={subscriptionPlan === 2 ? true : false}
              onPress={() => {
                setSubscriptionPlan(2);
                requestPurchase(trainProducts[2], onSuccess);
                // proceedToPurchase();
              }}
            />
          </View>

          <SimpleButton
            buttonText="Submit"
            buttonType={subscriptionPlan < 0 ? 'DISABLED' : 'AUTHENTICATION'}
            onPress={() => {
              proceedToSignup();
            }}
            buttonStyles={{
              marginTop: 33,
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default PaymentPlanContainer;
