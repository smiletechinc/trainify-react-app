import React, {FunctionComponent, useEffect, useState} from 'react';
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
// Custom UI components.
import {COLORS, SCREEN_WIDTH} from '../../constants';
import {TextInput} from '../../global-components/input';
import SignupFooterComponent from './components/SignupFooterComponent';
import PlayingStyle from './components/YourPlayingStyle';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';

import {StackActions, NavigationActions} from 'react-navigation';
import {
  signUpService,
  signInService,
  registerUserService,
} from '../../services/authenticationServices';
import {UserObject} from '../../types';

const signupMainImage = require('../../assets/images/small-logo.png');
const backIcon = require('../../assets/images/back-icon.png');

type Props = {
  navigation: any;
  route: any;
};
const SignupContainer: FunctionComponent<Props> = props => {
  const {navigation, route} = props;

  const email = route.params.signupObject.email;
  const password = route.params.signupObject.password;
  const handStyle = route.params.signupObject.playerstyle;
  const firstName = route.params.signupObject.firstName;
  const middleName = route.params.signupObject.middleName;
  const lastName = route.params.signupObject.lastName;
  const [height, setHeight] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');

  const proceedForPayments = () => {
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
      gender: 'male',
      playerstyle: handStyle === 0 ? 'LeftHanded' : 'RightHanded',
    };

    const authObject = route.params.authObject;

    navigation.navigate('PaymentPlan', {signupObject, authObject});
  };

  const validateForInputs = () => {
    if (height === '') {
      return false;
    }
    if (birthday === '') {
      return false;
    }
    if (location === '') {
      return false;
    }
    if (rating === '') {
      return false;
    }
    if (nationality === '') {
      return false;
    }
    return true;
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
        <View style={{marginTop: 16, paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <View style={{alignItems: 'center'}}>
            <AutoHeightImage source={signupMainImage} width={163} />
          </View>
          <Text
            style={[
              globalStyles.title,
              globalStyles.bold,
              {color: COLORS.medium_dark_blue, marginTop: 16},
            ]}>
            SIGN UP
          </Text>
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
            isButtonDisabled={!validateForInputs()}
            // onPress={proceedToSignup}
            onPress={proceedForPayments}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default SignupContainer;
