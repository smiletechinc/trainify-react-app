import React, { FunctionComponent, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image, Platform, Alert } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { GooglePay } from 'react-native-google-pay';

// Custom UI components.
import { COLORS, SCREEN_WIDTH } from '../../constants';
import {TextInput} from '../../global-components/input';
import ResetPasswordFooterComponent from './components/ResetPasswordFooter';
import {resetPasswordService} from './../../services/authenticationServices'

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';

const signinMainImage = require('../../assets/images/signin-main-image.png');

const ResetPasswordContainer: FunctionComponent = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
 
  const authenticationSuccess = () => {
      Alert.alert("Trainify", `Reset password email sent.`)
  }
  
  const authenticationFailure = (error) => {
    if(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert("Trainify", errorMessage)
    }
  }
  
  const proceedToResetPassword = () => {
    resetPasswordService(email, authenticationSuccess, authenticationFailure );
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
          <Text style={[globalStyles.title, globalStyles.bold, styles.reset_password_text]}>RESET PASSWORD</Text>
          <Text styles={[globalStyles.medium, styles.reset_password_details]}>Enter Your Email Address Below To Reset Password</Text>
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
          
          <ResetPasswordFooterComponent
          proceedToResetPassword={proceedToResetPassword}
            onPress={proceedToResetPassword}
          />
        </View>

      </KeyboardAwareScrollView>
    </View>
  )
};
export default ResetPasswordContainer;
