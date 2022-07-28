import React, {FunctionComponent, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// Custom UI components.
import {COLORS, SCREEN_WIDTH} from '../../constants';
import {TextInput} from '../../global-components/input';
import SignupFooterComponent from './components/SignupFooterComponent';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountryPicker from 'react-native-country-picker-modal';
import {appleAuth} from '@invertase/react-native-apple-authentication';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';
import {
  DatePickerModal,
  InchHeightPickerModal,
  FeetHeightPickerModal,
  CountryPickerModal,
  RatingPickerModal,
  LocationPickerModal,
} from '../../modals';
import {CountryCode, Country} from '../../modals/country';
import TextInputWrapper from './../../global-components/input/TextInputWrapper';

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
  const [birthday, setBirthday] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [nationality, setNationality] = useState<string>('');
  const [datepickermodalVisible, setDatePickerModalVisible] = useState(false);
  const [loctaionPickerModalVisible, setLocationPickerModalVisible] =
    useState(false);
  const [inchHeightPickerModalVisible, setinchHeightPickerModalVisible] =
    useState(false);
  const [ratingPickerModalVisible, setratingPickerModalVisible] =
    useState(false);
  const [feetHeightPickerModalVisible, setfeetHeightPickerModalVisible] =
    useState(false);
  const [countryPickerModalVisible, setcountryPickerModalVisible] =
    useState(false);
  const [inchHeight, setInchHeight] = useState('');
  const [feetHeight, setFeetHeight] = useState('');

  //Country picker:
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>();
  const [withFlag, setWithFlag] = useState<boolean>(true);
  const [withflagButton, setWithFlagButton] = useState<boolean>(false);
  const [withFilter, setWithFilter] = useState<boolean>(true);
  const [withCountryNameButton, setWithCountryNameButton] =
    useState<boolean>(false);

  const onSelect = (country: Country) => {
    setSelectedCountry(country.cca2);
    setWithFlagButton(true);
    setWithCountryNameButton(true);
    setNationality(country.name.toString());
  };

  const proceedForPayments = () => {
    const signupObject = {
      email,
      password,
      firstName,
      middleName,
      lastName,
      feetHeight,
      inchHeight,
      birthday,
      location,
      rating,
      nationality,
      gender,
      handStyle,
    };

    const authObject = route.params.authObject;

    navigation.navigate('PaymentPlan', {signupObject, authObject});
  };
  const validateForInputs = () => {
    if (feetHeight === '') {
      return false;
    }
    if (inchHeight === '') {
      return false;
    }
    // if (birthday === '') {
    //   return false;
    // }
    if (location === '') {
      return false;
    }
    if (rating === '') {
      return false;
    }
    // if (nationality === '') {
    //   return false;
    // }
    return true;
  };

  const handleSignInWithApple = async () => {
    // create login request for apple
    const appleAuthRequestResponse = await appleAuth.performRequest();

    console.log('appleAuthResoponse', appleAuthRequestResponse);
    const {identityToken, nonce} = appleAuthRequestResponse;
    if (identityToken) {
      //  const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);
      //  firebase.auth()
      //     .signInWithCredential(appleCredential)
      //     .then((user) => {
      //        // Succeed fully user logs in
      //     })
      //     .catch((error) => {
      //        // Something goes wrong
      //     });
    }
  };

  useEffect(() => {
    const sup = appleAuth.isSupported;
    console.log('supp', sup);
    handleSignInWithApple();
    // Alert.alert(handStyle);
  }, [route.params.signupObject.playerstyle]);
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
              marginBottom: 16,
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

          <Text style={[globalStyles.small, styles.optional_text]}>
            Optional
          </Text>

          <View
            style={{
              width: SCREEN_WIDTH * 0.9,
              paddingLeft: 8,
              backgroundColor: COLORS.white,
              marginTop: 4,
              marginBottom: 12,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={[
                globalStyles.h1,
                {
                  color: COLORS.dark_black,
                  marginTop: 4,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  paddingTop: 10,
                },
              ]}>
              Height
            </Text>
            <TextInput
              value={feetHeight}
              placeholder="Feet"
              placeholderTextColor={COLORS.dark_black}
              onChangeText={(value: string) => {
                setFeetHeight(value);
              }}
              editable={false}
              onClick={() => {
                setfeetHeightPickerModalVisible(true);
              }}
              inputStyles={{
                fontWeight: 'bold',
              }}
              inputParentStyles={{
                marginTop: 4,
                width: 100,
              }}
            />
            <TextInput
              value={inchHeight}
              placeholder="Inch"
              editable={false}
              placeholderTextColor={COLORS.dark_black}
              onChangeText={(value: string) => {
                setInchHeight(value);
              }}
              onClick={() => {
                setinchHeightPickerModalVisible(true);
              }}
              inputStyles={{
                fontWeight: 'bold',
              }}
              inputParentStyles={{
                marginTop: 4,
                width: 100,
              }}
            />
          </View>
          <Text style={[globalStyles.small, styles.optional_text]}>
            Optional
          </Text>
          <TextInput
            value={birthday}
            placeholder="Birthday"
            placeholderTextColor={COLORS.dark_black}
            editable={false}
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
              marginTop: 4,
              marginBottom: 12,
            }}
          />

          <Text style={[globalStyles.small, styles.optional_text]}>
            Optional
          </Text>
          <TextInput
            value={location}
            placeholder="Location"
            placeholderTextColor={COLORS.dark_black}
            onChangeText={(value: string) => {
              setLocation(value);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 4,
              marginBottom: 16,
            }}
          />

          <Text style={[globalStyles.small, styles.optional_text]}>
            Optional
          </Text>
          <TextInput
            value={rating}
            placeholder="Rating"
            placeholderTextColor={COLORS.dark_black}
            onChangeText={(value: string) => {
              setRating(value);
            }}
            editable={false}
            onClick={() => {
              setratingPickerModalVisible(true);
            }}
            inputStyles={{
              fontWeight: 'bold',
            }}
            inputParentStyles={{
              marginTop: 4,
              marginBottom: 16,
            }}
          />
          <Text style={[globalStyles.small, styles.optional_text]}>
            Optional
          </Text>
          <TextInputWrapper
            inputParentStyles={{
              marginTop: 4,
            }}>
            <CountryPicker
              {...{
                countryCode: selectedCountry,
                withFilter,
                withFlag,
                withflagButton,
                withCountryNameButton,
                onSelect,
              }}
            />
          </TextInputWrapper>

          {datepickermodalVisible && (
            <DatePickerModal
              visible={datepickermodalVisible}
              setBirthday={setBirthday}
              close={setDatePickerModalVisible}
            />
          )}
          {inchHeightPickerModalVisible && (
            <InchHeightPickerModal
              visible={inchHeightPickerModalVisible}
              setInch={setInchHeight}
              close={setinchHeightPickerModalVisible}
            />
          )}
          {feetHeightPickerModalVisible && (
            <FeetHeightPickerModal
              visible={feetHeightPickerModalVisible}
              setFeet={setFeetHeight}
              close={setfeetHeightPickerModalVisible}
            />
          )}
          {ratingPickerModalVisible && (
            <RatingPickerModal
              visible={ratingPickerModalVisible}
              setRating={setRating}
              close={setratingPickerModalVisible}
            />
          )}

          <SignupFooterComponent
            navigation={navigation}
            isButtonDisabled={false}
            onPress={proceedForPayments}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default SignupContainer;
