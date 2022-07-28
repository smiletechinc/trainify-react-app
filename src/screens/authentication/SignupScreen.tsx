import React, {FunctionComponent, useState} from 'react';
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
} from './../../services/authenticationServices';
import {UserObject} from '../../types';

const signupMainImage = require('../../assets/images/small-logo.png');
const backIcon = require('../../assets/images/back-icon.png');

type Props = {
  navigation: any;
};
const SignupScreen: FunctionComponent<Props> = ({navigation}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [handStyle, setHandStyle] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const navigtaionNext = () => {
    if (password !== confirmPassword) {
      Alert.alert('Trainify', 'Password and Confirm password does not match');
    } else if (password.length < 6) {
      Alert.alert('Trainify', 'Password should contain at-lease 6 characters.');
    } else {
      const signupObject = {
        email,
        password,
        firstName,
        middleName,
        lastName,
        playerstyle: handStyle === 0 ? 'LeftHanded' : 'RightHanded',
      };

      const authObject = {
        email,
        password,
      };
      navigation.navigate('SignupContainer', {signupObject, authObject});
    }
  };

  const validateForInputs = () => {
    if (email === '') {
      return false;
    }
    if (password === '') {
      return false;
    }
    if (confirmPassword === '') {
      return false;
    }
    if (firstName === '') {
      return false;
    }
    if (lastName === '') {
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
        <View
          style={{
            paddingHorizontal: SCREEN_WIDTH * 0.05,
            display: 'flex',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={styles.login_back_icon}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={backIcon} style={{width: 24, height: 24}} />
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
            }}>
            <AutoHeightImage source={signupMainImage} width={163} />
          </View>
        </View>
        <View style={{marginTop: 4, paddingHorizontal: SCREEN_WIDTH * 0.05}}>
          <Text
            style={[
              globalStyles.title,
              globalStyles.bold,
              {color: COLORS.medium_dark_blue, marginTop: 8},
            ]}>
            SIGN UP
          </Text>
          <TextInput
            value={email}
            placeholder="Email"
            placeholderTextColor={COLORS.dark_black}
            keyboardType="email-address"
            onChangeText={(value: string) => {
              setEmail(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 16,
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
              marginTop: 16,
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
              marginTop: 16,
              marginBottom: 12,
            }}
          />
          <PlayingStyle handStyle={handStyle} setHandStyle={setHandStyle} />
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
              marginTop: 16,
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
              marginTop: 16,
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
              marginTop: 16,
            }}
          />
          <SignupFooterComponent
            navigation={navigation}
            isButtonDisabled={!validateForInputs()}
            // onPress={proceedToSignup}
            onPress={navigtaionNext}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default SignupScreen;
