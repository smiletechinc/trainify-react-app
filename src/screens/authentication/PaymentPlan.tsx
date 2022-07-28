import React, {FunctionComponent, useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Alert,
  Button,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Custom UI components.
import {COLORS, SCREEN_WIDTH} from '../../constants';
import AppUserItem from './components/AppUserItem';
import AnimatedLoader from 'react-native-animated-loader';
import SubscriptionItem from './components/SubscriptionItem';
import {registerUserService} from './../../services/authenticationServices';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';
import {SimpleButton} from '../../global-components/button';
import {trainProducts, membershipProduct} from './products';

const signupMainImage = require('../../assets/images/small-logo.png');
const backIcon = require('../../assets/images/back-icon.png');
const registerUserAnimation = require('./../../assets/animations/register-user-animation.json');
const profileUserAnimation = require('./../../assets/animations/create-profile-animation.json');

import RNIap, {
  InAppPurchase,
  Product,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
} from 'react-native-iap';
import {UserObject} from '../../types';
import {useAuthentication, useProfile} from '../../hooks';
import {SettingContext} from '../../context/useSetting-context';
import {SubscriptionContext} from '../../context/useSubscriptionContext';

const itemSkus =
  Platform.select({
    ios: trainProducts,
    android: [...trainProducts],
  }) || [];

const itemSubs =
  Platform.select({
    ios: [membershipProduct],
    android: [membershipProduct],
  }) || [];

const uploadAnimation = require('./../../assets/animations/uploading-animation.json');
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

let purchaseUpdateSubscription2;
let purchaseErrorSubscription2;

type Props = {
  route: any;
  navigation: any;
};

const PaymentPlanContainer: FunctionComponent<Props> = props => {
  const {route, navigation} = props;
  const {authObject, signupObject} = route.params;
  const [playerSelected, setPlayerSelected] = useState<number>(0);
  const [productList, setProductList] = useState([]);
  const [coursePurchaseInProgress, setCoursePurchaseInProgress] =
    useState(false);
  const [sucessCalled, setSucessCalled] = useState(false);
  const [restoredPurchase, setRestoredPurchase] = useState(false);
  const [finishedSetup, setFinishedSetup] = useState(false);
  const [errorInSetup, setErrorInSetup] = useState(false);
  const [requestedNewPurchase, setRequestedNewPurchase] = useState(false);
  const {isTermCheck, isPrivacyCheck} = React.useContext(SettingContext);
  const [subscriptionDetected, setSubscriptionDetected] = useState(false);
  const {
    subscriptionPlan,
    subscriptionStatus,
    animationVisible,
    validProduct,
    setSubscriptionPlan,
    setSubscriptionStatus,
    setAnimationVisible,
    setValidProduct,
  } = React.useContext(SubscriptionContext);
  var subscriptionValue = '';

  const {
    creatingAccount,
    registerUserStatus,
    registerErrorStatus,
    signUpService,
    signInService,
    cancelUploading,
    registeredUserObject,
  } = useAuthentication({
    authObject: authObject,
  });

  useEffect(() => {
    setAnimationVisible(true);
    console.log('UseEffect!');
    setupApplePay();
    return () => {
      removeApplePay();
    };
  }, []);

  useEffect(() => {
    if (!validProduct) {
      setSubscriptionPlan(1);
      setAnimationVisible(false);
    } else if (isTermCheck && isPrivacyCheck) {
      requestSubscriptionFunction();
    }
  }, [isTermCheck, isPrivacyCheck]);

  useEffect(() => {
    if (sucessCalled) {
      Alert.alert('Subscription purchased');
      console.log('successfully puchased');
      setAnimationVisible(false);
      setSubscriptionPlan(2);
      setSubscriptionStatus('Paid');
      console.log('subscriptionPlan after update', subscriptionPlan);
      console.log(
        'subscription value after sucess purchase',
        subscriptionStatus,
      );
    }
  }, [sucessCalled]);
  useEffect(() => {
    if (registerErrorStatus) {
      Alert.alert(registerErrorStatus);
    } else if (registeredUserObject) {
      (() => {
        console.log('subscriptionPlan', subscriptionPlan);
        if (subscriptionPlan === 1) {
          subscriptionValue = 'Basic';
          console.log(subscriptionValue);
        } else if (subscriptionPlan === 2) {
          subscriptionValue = 'Premium';
          console.log('subscriptionValue', subscriptionValue);
        }
        proceedToCreateProfile(registeredUserObject);
      })();
    }
  }, [registeredUserObject, registerErrorStatus]);

  const proceedToLogin = () => {
    navigation.replace('Signin');
  };

  async function setupApplePay() {
    getItems();
    try {
      const result = await RNIap.initConnection();
      console.log('connection is => ', result);
      setErrorInSetup(false);
      setFinishedSetup(true);
      setAnimationVisible(false);
    } catch (err) {
      console.log('error in cdm => ', err);
      setAnimationVisible(false);
      setFinishedSetup(true);
      setErrorInSetup(true);
      setAnimationVisible(false);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
        console.log('purchaseData', JSON.stringify(purchase));
        if (purchase.productId === membershipProduct) {
          setValidProduct(true);
          console.log('purchase.productId', purchase.productId);
          setSubscriptionDetected(true);
          Alert.alert(
            'Subscription Detected',
            'This apple id is registered with another account, please login',
            [
              {
                text: 'Free Signup',
                onPress: () => {
                  setAnimationVisible(false);
                  setSubscriptionStatus('Error');
                  setSubscriptionPlan(1);
                },
              },
              {text: 'Login', onPress: proceedToLogin},
            ],
            {cancelable: false},
          );
        } else {
          setValidProduct(false);
          console.log('error finish purchase.productId', purchase.productId);
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      async (error: PurchaseError) => {
        setCoursePurchaseInProgress(false);
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
        switch (error.code) {
          case 'E_USER_CANCELLED':
            setAnimationVisible(false);
            Alert.alert('Subscription was not sucessful');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            break;
          case 'E_ALREADY_OWNED':
            Alert.alert(
              'Subscription Detected',
              'This apple id is registered with another account, please login',
              [
                {
                  text: 'Go Back',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
                {text: 'Login', onPress: proceedToLogin},
              ],
              {cancelable: false},
            );
            setAnimationVisible(false);
            setSubscriptionStatus('Paid');
            setSubscriptionPlan(2);
            break;
          case 'E_IAP_NOT_AVAILABLE':
            setAnimationVisible(false);
            Alert.alert('This subscription is not available');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            break;
          case 'E_ITEM_UNAVAILABLE':
            setAnimationVisible(false);
            Alert.alert('This subscription is unavailable');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            break;
          case 'E_NETWORK_ERROR':
            setAnimationVisible(false);
            Alert.alert(
              'Subscription was not completed because of network error',
            );
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            break;
          case 'E_DEVELOPER_ERROR':
            setAnimationVisible(false);
            Alert.alert('This subscription is not available yet.');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            setValidProduct(false);
            break;
          case 'E_UNKNOWN_ERROR':
            setAnimationVisible(false);
            Alert.alert('Unknown Error from apple server.');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            setValidProduct(false);
            setRequestedNewPurchase(false);
            break;
          default:
            Alert.alert(
              `Subscription Purchase Error, ${JSON.stringify(
                error,
              )}, IAP purchaseErrorListener`,
            );
            setAnimationVisible(false);
            setSubscriptionPlan(1);
            setSubscriptionStatus('Error');
        }
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
      setAnimationVisible(false);
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

  // function proceedToPurchase() {
  //   requestSubscription(trainProducts[subscriptionPlan]);
  // }

  const proceedToCreateProfile = firebaseObject => {
    console.log('firebase object:', firebaseObject);
    const userObject: UserObject = {
      ...signupObject,
      id: firebaseObject.uid,
      paymentPlan: subscriptionValue,
    };
    registerUserService(userObject, registrationSuccess, registrationFailure);
  };

  const goToSigninPage = () => {
    navigation.replace('Signin');
  };

  const registrationSuccess = (userCredential?: any) => {
    console.log('userCredential', userCredential);
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

  const proceedToSignup = () => {
    signUpService(authObject);
  };

  // const onSuccess = () => {
  //   console.log('successfully puchased');
  //   setSubscriptionPlan(2);
  //   subscriptionPlan === 2
  //     ? setSubscriptionStatus('Paid')
  //     : setSubscriptionStatus('Error');
  //   setAnimationVisible(false);
  //   console.log('subscriptionPlan after update', subscriptionPlan);
  //   console.log('subscription value after sucess purchase', subscriptionStatus);
  // };

  async function requestPurchase(sku) {
    purchaseUpdateSubscription.remove();
    purchaseUpdateSubscription = null;
    purchaseErrorSubscription.remove();
    purchaseErrorSubscription = null;

    purchaseUpdateSubscription2 = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        purchaseUpdateSubscription2.remove();
        purchaseUpdateSubscription2 = null;
        console.log('purchaseData', JSON.stringify(purchase));
        if (purchase.productId === membershipProduct) {
          setValidProduct(true);
          console.log('purchase.productId', purchase.productId);
          // setSubscriptionPlan(2);
          // onSuccess();
          // if (requestedNewPurchase) {
          setSucessCalled(true);
          // setRestoredPurchase(false);
          Alert.alert('New purchase success!');
          // } else {
          //   setRestoredPurchase(true);
          //   Alert.alert(
          //     'Subscription Detected',
          //     'This apple id is registered with another account, please login',
          //     [
          //       {
          //         text: 'Free Signup',
          //         onPress: () => {
          //           // navigation.goBack();
          //           setAnimationVisible(false);
          //           setSubscriptionStatus('Error');
          //           setSubscriptionPlan(1);
          //         },
          //       },
          //       {text: 'Login', onPress: proceedToLogin},
          //     ],
          //     {cancelable: false},
          //   );
          // }
        } else {
          setValidProduct(false);
          console.log('error finish purchase.productId', purchase.productId);
        }
      },
    );

    purchaseErrorSubscription2 = purchaseErrorListener(
      async (error: PurchaseError) => {
        setCoursePurchaseInProgress(false);
        purchaseErrorSubscription2.remove();
        purchaseErrorSubscription2 = null;
        switch (error.code) {
          case 'E_USER_CANCELLED':
            setAnimationVisible(false);
            Alert.alert('Subscription was not sucessful');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            break;
          case 'E_ALREADY_OWNED':
            Alert.alert(
              'Subscription Detected',
              'This apple id is registered with another account, please login',
              [
                {
                  text: 'Go Back',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
                {text: 'Login', onPress: proceedToLogin},
              ],
              {cancelable: false},
            );
            setAnimationVisible(false);
            setSubscriptionStatus('Paid');
            setSubscriptionPlan(2);
            break;
          case 'E_IAP_NOT_AVAILABLE':
            setAnimationVisible(false);
            Alert.alert('This subscription is not available');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            break;
          case 'E_ITEM_UNAVAILABLE':
            setAnimationVisible(false);
            Alert.alert('This subscription is unavailable');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            break;
          case 'E_NETWORK_ERROR':
            setAnimationVisible(false);
            Alert.alert(
              'Subscription was not completed because of network error',
            );
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            break;
          case 'E_DEVELOPER_ERROR':
            setAnimationVisible(false);
            Alert.alert('This subscription is not available yet.');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            setValidProduct(false);
            break;
          case 'E_UNKNOWN_ERROR':
            setAnimationVisible(false);
            Alert.alert('Unknown Error from apple server.');
            setSubscriptionStatus('Error');
            setSubscriptionPlan(1);
            setValidProduct(false);
            setRequestedNewPurchase(false);
            break;
          default:
            Alert.alert(
              `Subscription Purchase Error, ${JSON.stringify(
                error,
              )}, IAP purchaseErrorListener`,
            );
            setAnimationVisible(false);
            setSubscriptionPlan(1);
            setSubscriptionStatus('Error');
        }
      },
    );

    try {
      const dangerouslyFinishTransactionAutomatically = false;
      console.log(
        'subscription value when requesting purchase',
        subscriptionPlan,
      );
      console.log(
        'subscription status when requesting purchase',
        subscriptionStatus,
      );
      RNIap.requestPurchase(
        sku,
        dangerouslyFinishTransactionAutomatically,
      ).then(res => {
        console.log(`Purchase success`, JSON.stringify(res));
        // setSubscriptioNStatus('Paid');
        // setAnimationVisible(false);
        // setSubscriptionPlan(2);
        // onSuccess();
      });
    } catch (err) {
      console.log(`requestPurchase error => , ${err}`);
      setAnimationVisible(false);
      setSubscriptionStatus('Error');
    }
  }

  const requestSubscriptionFunction = () => {
    setRequestedNewPurchase(true);
    if (subscriptionDetected) {
      Alert.alert(
        'Subscription Detected',
        'This apple id is registered with another account, please login',
        [
          {
            text: 'Free Signup',
            onPress: () => {
              // navigation.goBack();
              setAnimationVisible(false);
              setSubscriptionStatus('Error');
              setSubscriptionPlan(1);
            },
          },
          {text: 'Login', onPress: proceedToLogin},
        ],
        {cancelable: false},
      );
    } else if (isTermCheck && isPrivacyCheck) {
      if (subscriptionStatus !== 'Paid') {
        setAnimationVisible(true);
        console.log('requesteForSubscription');
        requestPurchase(trainProducts[0]);
      } else {
        setSubscriptionPlan(2);
      }
    } else if (isTermCheck) {
      navigation.navigate('PrivacyPolicyScreen');
    } else {
      navigation.navigate('TermsConditionScreen');
    }
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

            <SubscriptionItem
              leftText="Basic"
              rightText="Serve Practice Only"
              price="Free"
              isSelected={subscriptionPlan === 1 ? true : false}
              limitText="Video Recording for 2 Hrs/ Mo  (60 Day Trial)"
              onPress={() => {
                setSubscriptionPlan(1);
              }}
            />
            <SubscriptionItem
              leftText="Premium"
              rightText="Serve Practice/Practice with Ball Machine"
              price="$9.99/Per Month"
              isSelected={subscriptionPlan === 2 ? true : false}
              limitText="5 Hours Video Recording/Per Month"
              onPress={() => {
                requestSubscriptionFunction();
              }}
            />
          </View>

          <SimpleButton
            buttonText="Submit"
            buttonType={
              subscriptionPlan === 1 ||
              (subscriptionPlan === 2 && subscriptionStatus === 'Paid')
                ? 'AUTHENTICATION'
                : 'DISABLED'
            }
            onPress={() => {
              proceedToSignup();
            }}
            buttonStyles={{
              marginTop: 33,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 47,
            paddingHorizontal: SCREEN_WIDTH * 0.05,
          }}>
          <AnimatedLoader
            visible={creatingAccount}
            overlayColor={'rgba(255, 255, 255, 0.75)'}
            source={
              creatingAccount ? registerUserAnimation : profileUserAnimation
            }
            animationStyle={styles.lottie}
            speed={1}>
            <Text>{creatingAccount ? registerUserStatus : false}</Text>
            <Button
              title={'Cancel'}
              onPress={() => {
                cancelUploading();
                navigation.navigate('Signup');
              }}
            />
          </AnimatedLoader>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 47,
            paddingHorizontal: SCREEN_WIDTH * 0.05,
          }}>
          <AnimatedLoader
            visible={animationVisible}
            overlayColor={'rgba(255, 255, 255, 0.75)'}
            source={uploadAnimation}
            animationStyle={styles.lottie}
            speed={1}>
            <Text>
              {animationVisible ? 'Waiting for subscription ' : false}
            </Text>
          </AnimatedLoader>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default PaymentPlanContainer;
