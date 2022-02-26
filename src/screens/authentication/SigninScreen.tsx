import React, { FunctionComponent, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image, Platform, Alert } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { GooglePay } from 'react-native-google-pay';
import {useDispatch, useSelector} from 'react-redux';
import {setUserObject} from '../../redux/slices/AuthSlice';
// Custom UI components.
import { COLORS, SCREEN_WIDTH } from '../../constants';
import {TextInput} from '../../global-components/input';
import SigninFooterComponent from './components/SigninFooterComponent';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';

const signinMainImage = require('../../assets/images/signin-main-image.png');
const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackActions, NavigationActions } from 'react-navigation';

import {signInService, getUserWithIdService} from './../../services/authenticationServices'
import { UserObject } from '../../types';
import { AuthContext } from './../../context/auth-context';
import { RootState } from '../../../store';
const backIcon = require('../../assets/images/back-icon.png');

type Props = {
  navigation?: any;
  route?: any;
}

const SigninContainer: FunctionComponent<Props> = (props) => {
  const { authUser, setAuthUser, setAuthObject } = React.useContext(AuthContext);
  // console.log('UserData: ', UserData);
  const {navigation, route} = props;
  const [email, setEmail] = useState<string>('Testing@gmail.com');
  const [password, setPassword] = useState<string>('123456');
  const dispatch = useDispatch();

  const goToHomePage = (userObject) => {
    const user: UserObject = userObject;
    // console.log('userObject : ', user);
    setAuthUser(user);
    dispatch(setUserObject(user));
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
    // navigation.navigate('MainApp');
}


const getUsrObject = (userCredential) => {
  // console.log('userCredential : ', userCredential);
  let uid = userCredential.uid;
  // console.log('uid : ', uid);

  getUserWithIdService(uid, goToHomePage, authenticationFailure)

  // getUserWithIdService(uid, goToHomePage, authenticationFailure)

}

const authenticationSuccess = (userCredential?:any) => {
  if (userCredential) {
    setAuthObject(userCredential);
    console.log('userCredential : ', userCredential);
    const user = userCredential.user;
    // Alert.alert("Trainify", `You've logged in successfully ${JSON.stringify(user)}`)
    getUsrObject(userCredential);
  }
}

const authenticationFailure = (error) => {
  if(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    Alert.alert("Trainify", errorMessage)
  }
}

const proceedToLogin = () => {
  const authObject = {
    email,
    password,
  }
  signInService(authObject, authenticationSuccess, authenticationFailure );
}

  // const proceedToLogin = () => {
  //   if(app){
  //     const auth = getAuth();
  //     signInWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //     // Signed in
  //     const user = userCredential.user;
  //     Alert.alert("Trainify", "You've logged in successfully")
  //     goToHomePage()
  
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     Alert.alert("Trainify", errorMessage)
  //   });
  //   }
 
  // } 

  const requestData = {
    cardPaymentMethod: {
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        // stripe (see Example):
        gateway: 'stripe',
        gatewayMerchantId: '',
        stripe: {
          publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
          version: '2018-11-08',
        },
        // other:
      },
      allowedCardNetworks,
      allowedCardAuthMethods,
    },
    transaction: {
      totalPrice: '10',
      totalPriceStatus: 'FINAL',
      currencyCode: 'USD',
    },
    merchantName: 'Example Merchant',
  };
  const isGooglePayAvailable = () => {
    GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
    .then((ready) => {
      
      if (ready) {
        // Request payment token
        console.log('it is ready.', ready);
        GooglePay.requestPayment(requestData)
          .then((token: string) => {
            console.log('token here: ', token);
            // Send a token to your payment gateway
          })
          .catch((error) => console.log('payment error: ', error.code, error.message));
      }
    }).catch((error) => {
      console.log('error: ', error);
    })
  }
  return(
    <View style={styles.login_main_container}>
      <KeyboardAwareScrollView
        bounces={false}
        
      >

        <View style={{paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <TouchableOpacity
            style={styles.login_back_icon}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image source={backIcon} style={{width: 32, height: 32}}/>

          </TouchableOpacity>
          </View>

        <View style={{marginTop: 47, paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <AutoHeightImage 
            source={signinMainImage}
            width={SCREEN_WIDTH * 0.76}
          />
          <Text style={[globalStyles.title, globalStyles.bold, {color: COLORS.medium_dark_blue, marginTop: 16}]}>SIGN IN</Text>
          <TextInput
            value={email}
            onChangeText={(value: string) => {
              setEmail(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 42,
            }}
          />
          <TextInput
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(value: string) => {
              setPassword(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />

          <SigninFooterComponent 
            onPress={() => {
              // console.log('pressed')
              // isGooglePayAvailable();
            }}
            proceedToLogin={proceedToLogin}
            forgorPasswordOnPress={()=>{
              navigation.navigate('ResetPassword');
            }}

            signupScreenOnPress={()=>{
              navigation.navigate('Signup');
            }}
          />
        </View>

      </KeyboardAwareScrollView>
    </View>
  )
};
export default SigninContainer;
