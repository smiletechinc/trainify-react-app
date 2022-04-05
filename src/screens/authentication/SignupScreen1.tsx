import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  Platform,
  Alert,
  Button,
  Modal,
  Pressable,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// Custom UI components.
import {COLORS, SCREEN_WIDTH} from '../../constants';
import {TextInput} from '../../global-components/input';
import SignupFooterComponent from './components/SignupFooterComponent';
import PlayingStyle from './components/YourPlayingStyle';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';
import DatePickerModal from '../../modals/DateTimePicekr';
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
  const [gender, setGender] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');
  const [datepickermodalVisible, setDatePickerModalVisible] = useState(false);

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
      gender,
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

  const data = [
    {
      label: 'Male',
    },
    {
      label: 'Female',
    },
    {
      label: 'Other',
    },
  ];
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
        <View style={{marginTop: 8, paddingHorizontal: SCREEN_WIDTH * 0.05}}>
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
          <View
            style={{
              width: SCREEN_WIDTH * 0.9,
              paddingLeft: 8,
              backgroundColor: COLORS.white,
              marginTop: 8,
            }}>
            <Text
              style={[
                globalStyles.h1,
                {color: COLORS.dark_black, marginTop: 16, fontWeight: 'bold'},
              ]}>
              Gender
            </Text>
            <RadioButtonRN
              data={data}
              box={false}
              selectedBtn={e => setGender(e)}
              animationTypes={['shake']}
              style={{
                borderStyle: 'solid',

                marginLeft: 0,
                display: 'flex',
                flexDirection: 'row',
              }}
              boxStyle={{
                dipslay: 'flex',
                flexDirection: 'row',
                width: 120,
                justifyContent: 'space-around',
                borderStyle: 'solid',
              }}
              textStyle={styles.textStyle}
              icon={<Icon name="check-circle" size={25} color="#2c9dd1" />}
            />
          </View>
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
            editable={false}
            // secureTextEntry={true}
            onChangeText={(value: string) => {
              setBirthday(value);
            }}
            onClick={() => {
              setDatePickerModalVisible(true);
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
          {datepickermodalVisible && (
            <DatePickerModal
              visible={datepickermodalVisible}
              setBirthday={setBirthday}
              close={setDatePickerModalVisible}
            />
          )}
          <SignupFooterComponent
            navigation={navigation}
            isButtonDisabled={!validateForInputs()}
            onPress={proceedForPayments}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default SignupContainer;
