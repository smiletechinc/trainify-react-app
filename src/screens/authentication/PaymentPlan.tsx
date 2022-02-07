import React, { FunctionComponent, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image, Platform, Alert } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// const PaymentRequest = require('react-native-payments').PaymentRequest;

// Custom UI components.
import { COLORS, SCREEN_WIDTH } from '../../constants';
import {TextInput} from '../../global-components/input';
import SignupFooterComponent from './components/SignupFooterComponent';
import AppUserItem from './components/AppUserItem';
import SubscriptionItem from './components/SubscriptionItem';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';
import { SimpleButton } from '../../global-components/button';
import { UserObject } from '../../types';

import {signUpService, signInService, registerUserService} from './../../services/authenticationServices';


const signupMainImage = require('../../assets/images/small-logo.png');

const PaymentPlanContainer: FunctionComponent = ({ route, navigation }) => {
  const signupObject = route.params.signupObject;
  const authObject = route.params.authObject;

  const [playerSelected, setPlayerSelected] = useState<number>(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState<number>(0);

  const proceedToRegister = (user) => {
    const id = user.uid;
    const userType = playerSelected === 0 ? "COACH" : playerSelected === 1 ? "SELF" : 'CHILDREN';
    const subscriptionType = subscriptionPlan === 0 ? "COACH" : subscriptionPlan === 1 ? "SELF" : 'CHILDREN';
    const userObject: UserObject = {
      id,
      userType,
      email:signupObject.email,
      firstName:signupObject.firstName,
      middleName:signupObject.middleName,
      lastName:signupObject.lastName,
      height:signupObject.height,
      birthday:signupObject.birthday,
      location:signupObject.location,
      rating:signupObject.rating,
      nationality:signupObject.nationality,
      gender:signupObject.gender,
      playerstyle :signupObject.playerstyle,
      paymentPlan: subscriptionType,
    };
  
    registerUserService(userObject,registrationSuccess,authenticationFailure);
  }
  
  const goToLoginScreen = () => {
      navigation.navigate('Signin');
  }
  
  const registrationSuccess = (userCredential?:any) => {
      Alert.alert("Trainify", `You've signed up successfully.`)
      goToLoginScreen();
  }
  
  const authenticationSuccess = (user?:any) => {
    console.log("Signup: ", JSON.stringify(user));
    if (user) {
      proceedToRegister(user);
    }
  }
  
  const authenticationFailure = (error) => {
    if(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert("Trainify", errorMessage)
    }
  }
  
  const proceedToSignup = () => {
    signUpService(authObject, authenticationSuccess, authenticationFailure );
  }

  return(
    <View style={styles.login_main_container}>
      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: 55,
        }}
        
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
        <View style={{marginTop: 47, paddingHorizontal: SCREEN_WIDTH * 0.05,}}>
          <View style={{alignItems: 'center'}}>
            <AutoHeightImage 
              source={signupMainImage}
              width={163}
            />
          </View>
          <View>
            <Text style={[globalStyles.h1, {color: COLORS.dark_black, marginTop: 16, lineHeight: 30, fontWeight: '600'}]}>WHO’S USING THE APP?</Text>
            <AppUserItem
              leftText="Coach"
              onPress={()=>{
                setPlayerSelected(0);
              }}
              isSelected = {playerSelected === 0 ? true : false}
            />
            <AppUserItem
              leftText="Player Self Tracking"
              onPress={()=>{
                setPlayerSelected(1);
              }}
              isSelected = {playerSelected === 1 ? true : false}
            />
            <AppUserItem
              leftText="Parent for Child Tracking"
              onPress={()=>{
                setPlayerSelected(2);
              }}
              isSelected = {playerSelected === 2 ? true : false}
            />
          </View>
          <View>
            <Text style={[globalStyles.h1, {color: COLORS.dark_black, marginTop: 47, lineHeight: 30, fontWeight: '600'}]}>SUBSCRIPTION TIERS</Text>
            
            <SubscriptionItem
              leftText="Basic"
              price="$74.99/yr"
              isSelected = {subscriptionPlan === 0 ? true : false}
              onPress={() => {
                setSubscriptionPlan(0);
              }}
            />
            <SubscriptionItem
              leftText="Silver"
              price="$74.99/yr"
              isSelected = {subscriptionPlan === 1 ? true : false}
              onPress={() => {
                setSubscriptionPlan(1);
              }}
            />
            <SubscriptionItem
              leftText="Platinum"
              price="$74.99/yr"
              isSelected = {subscriptionPlan === 2 ? true : false}
              onPress={() => {
                setSubscriptionPlan(2);
              }}
            />
          </View>
          
          <SimpleButton
            buttonText="Submit"
            buttonType="AUTHENTICATION"
            onPress={()=>{
              if(proceedToSignup) {
                proceedToSignup();
              }
            }}
            buttonStyles={{
              marginTop: 33,
            }}
          />
        </View>

      </KeyboardAwareScrollView>
    </View>
  )
};
export default PaymentPlanContainer;
