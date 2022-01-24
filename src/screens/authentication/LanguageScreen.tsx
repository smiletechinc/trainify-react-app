import React, { FunctionComponent, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Platform } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { GooglePay } from 'react-native-google-pay';

// Custom UI components.
import { COLORS, SCREEN_WIDTH } from '../../constants';
import AppUserItem from './components/AppUserItem';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';
import { SimpleButton } from '../../global-components/button';

const languagePic = require('../../assets/images/language-pic.png');
const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const LanguageScreenContainer: FunctionComponent = ({navigation}) => {
 
  const [language, setLanguage] = useState<string>('english');

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
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View style={{flex: 1, marginTop: 47, paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <AutoHeightImage 
            source={languagePic}
            width={SCREEN_WIDTH * 0.9}
          />
          <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: Platform.OS === 'ios'?  70 : 40}}>
            <AppUserItem
              leftText="English"
              onPress={()=>{
                setLanguage('english');
              }}
              isSelected = {language === 'english' ? true : false}
            />
            <AppUserItem
              leftText="German"
              onPress={()=>{
                setLanguage('german');
              }}
              isSelected = {language === 'german' ? true : false}
            />
            <SimpleButton 
              buttonText="Select"
              onPress={()=>{
                navigation.navigate('Signin', {language: language});
              }}
              buttonType="AUTHENTICATION"
              buttonStyles={{
                marginTop: 26,
              }}
            />
          </View>
        </View>

      </KeyboardAwareScrollView>
    </View>
  )
};
export default LanguageScreenContainer;
