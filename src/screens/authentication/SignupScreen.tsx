import React, { FunctionComponent, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image, Platform, Alert } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Custom UI components.
import { COLORS, SCREEN_WIDTH } from '../../constants';
import {TextInput} from '../../global-components/input';
import SignupFooterComponent from './components/SignupFooterComponent';
import PlayingStyle from './components/YourPlayingStyle';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';

<<<<<<< Updated upstream
import { StackActions, NavigationActions } from 'react-navigation';
import {signUpService, signInService, registerUserService} from './../../services/authenticationServices';
=======
import { UserObject } from '../../types';
>>>>>>> Stashed changes

import { UserObject } from '../../types';

const signupMainImage = require('../../assets/images/small-logo.png');
const backIcon = require('../../assets/images/back-icon.png');

const SigninContainer: FunctionComponent = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [handStyle, setHandStyle] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');

  const proceedForPayments = () => {
    if (password === confirmPassword) {
      const signupObject = {
        email,
        password,
        firstName,
        middleName,
        lastName,
        height,
        birthday,
        location,
        rating,
        nationality,
        gender:'male',
        playerstyle : handStyle === 0 ? 'LeftHanded' : 'RightHanded'
      }

      const authObject = {
        email,
        password,
      }

      navigation.navigate('PaymentPlan', {signupObject, authObject});
    } else {
      Alert.alert('Trainify', 'Password and Confirm password does not match');
    }
  }

const validateForInputs = () => {

  if(email === '') {
    return false;
  }
  if (password === '') {
    return false;
  }
  if (confirmPassword === ''){
    return false;
  }
  if (firstName === '') {
    return false;
  }
  if (lastName === '') {
    return false;
  }
  if (height === ''){
    return false;
  }
  if (birthday === '') {
    return false;
  }
  if (location === ''){
    return false;
  }
  if (rating === '') {
    return false;
  }
  if (nationality === ''){
    return false;
  }
  return true
}

//   const proceedToSignup = () => {
//     const auth = getAuth();
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed up
//     const user = userCredential.user;
//     Alert.alert("Trainify", "You've signed up successfully")
//     goToHomePage()
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     Alert.alert("Trainify", errorMessage)
//   });
//   }

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
            <Image source={backIcon} style={{width: 32, height: 32}}/>

          </TouchableOpacity>
        </View>
        <View style={{marginTop: 47, paddingHorizontal: SCREEN_WIDTH * 0.05,}}>
          <View style={{alignItems: 'center'}}>
            <AutoHeightImage 
              source={signupMainImage}
              width={163}
            />
          </View>
          <Text style={[globalStyles.title, globalStyles.bold, {color: COLORS.medium_dark_blue, marginTop: 16,}]}>SIGN UP</Text>
          <TextInput
            value={email}
            placeholder="Email"
            placeholderTextColor={COLORS.dark_black}
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
            placeholderTextColor={COLORS.dark_black}
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
          <TextInput
            value={confirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor={COLORS.dark_black}
            secureTextEntry={true}
            onChangeText={(value: string) => {
              setConfirmPassword(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          <PlayingStyle 
            handStyle={handStyle}
            setHandStyle={setHandStyle}
          />
          <TextInput
            value={firstName}
            placeholder="First name"
            placeholderTextColor={COLORS.dark_black}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setFirstName(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          <TextInput
            value={middleName}
            placeholder="Middle name"
            placeholderTextColor={COLORS.dark_black}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setMiddleName(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          <TextInput
            value={lastName}
            placeholder="Last name"
            placeholderTextColor={COLORS.dark_black}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setLastName(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          <TextInput
            value={height}
            placeholder="Height"
            placeholderTextColor={COLORS.dark_black}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setHeight(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          <TextInput
            value={birthday}
            placeholder="Birthday"
            placeholderTextColor={COLORS.dark_black}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setBirthday(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          <TextInput
            value={location}
            placeholder="Location"
            placeholderTextColor={COLORS.dark_black}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setLocation(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          <TextInput
            value={rating}
            placeholder="Rating"
            placeholderTextColor={COLORS.dark_black}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setRating(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          <TextInput
            value={nationality}
            placeholder="Nationality"
            placeholderTextColor={COLORS.dark_black}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setNationality(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 29,
            }}
          />
          
          <SignupFooterComponent
            navigation={navigation}
            isButtonDisabled = {!validateForInputs()}
            // onPress={proceedToSignup}
            onPress={proceedForPayments}
          />
        </View>

      </KeyboardAwareScrollView>
    </View>
  )
};
export default SigninContainer;
