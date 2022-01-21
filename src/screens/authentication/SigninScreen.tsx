import React, { FunctionComponent, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image, Platform } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { GooglePay } from 'react-native-google-pay';

// Custom UI components.
import { COLORS, SCREEN_WIDTH } from '../../constants';
import {TextInput} from '../../global-components/input';
import SigninFooterComponent from './components/SigninFooterComponent';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';

import { PrimaryButton } from './components/buttons';

const signinMainImage = require('../../assets/images/signin-main-image.png');
const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const SigninContainer: FunctionComponent = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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

          </TouchableOpacity>
        </View>
        <View style={{marginTop: 47, paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <AutoHeightImage 
            source={signinMainImage}
            width={SCREEN_WIDTH * 0.9}
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
            forgorPasswordOnPress={()=>{
              // navigation.navigate('ResetPassword');
            }}

            signupScreenOnPress={()=>{
              // console.log()
              navigation.navigate('Signup');
            }}
          />
        </View>

      </KeyboardAwareScrollView>
    </View>
  )
};
export default SigninContainer;
