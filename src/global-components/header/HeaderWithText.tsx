import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SCREEN_WIDTH} from '../../constants';
import globalStyles from '../../global-styles';
import styles from './styles';
import {AuthContext} from './../../context/auth-context';
import {RootState} from '../../../store';
import {useSelector} from 'react-redux';
import {logoutService} from '../../services/authenticationServices';
import RNRestart from 'react-native-restart'; // Import package from node modules

const profileIcon = require('../../assets/images/profile-icon.png');
const backIcon = require('../../assets/images/back-icon.png');
const userIcon = require('../../assets/images/use_logout_icon.png');

type Props = {
  text: string;
  hideProfileSection?: boolean;
  navigation: any;
  hideBackButton?: boolean;
  logOutCheck?: boolean;
};
const HeaderWithText: FunctionComponent<Props> = props => {
  // const navigation = useNavigation();
  const [userFirstName, setuserFirstName] = useState('User');
  const UserData = useSelector(
    (state: RootState) => state.RegisterReducer.UserData,
  );
  const {text, hideProfileSection, navigation, hideBackButton, logOutCheck} =
    props;

  const {
    authUser,
    authObject,
    setAuthUser: setUser,
    logoutUser,
  } = React.useContext(AuthContext);

  useEffect(() => {
    if (authObject) {
      console.log('authObject ', authObject);
      const {firstName} = authObject;
      setuserFirstName(firstName);
    } else {
      proceedToRemoveUser();
    }
    if (authUser) {
      console.log('authUser ', authUser);
    }
  }, [authUser, authObject]);

  const proceedToRemoveUser = () => {
    console.log('Removing user from context.');
    logoutUser();
    navigation.replace('Signin');
  };

  const logoutAlert = () => {
    navigation.navigate('Signout');
  };

  const logoutSuccess = (userCredential?: any) => {
    console.log('Logout sucess from firebase');
    logoutUser();
    // navigation.replace('SplashScreen');
    RNRestart.Restart();
  };

  const logoutFailure = error => {
    console.log('Error in logout from firebase');
    logoutUser();
    // navigation.replace('SplashScreen');
    RNRestart.Restart();
  };

  const proceedToLogout = () => {
    logoutService(logoutSuccess, logoutFailure);
  };

  return (
    <View style={styles.header_with_text_main_view}>
      {!hideBackButton && (
        <TouchableOpacity
          style={{
            width: 40,
            display: 'flex',
            justifyContent: 'center',
            height: 40,
            alignItems: 'flex-start',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={backIcon} style={{width: 24, height: 24}} />
        </TouchableOpacity>
      )}
      <View style={{flex: 1}}>
        <Text style={[globalStyles.regular, styles.text]}>{text}</Text>
      </View>
      {!logOutCheck && (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            display: hideProfileSection ? 'none' : 'flex',
          }}
          onPress={() => {
            logoutAlert();
          }}>
          <Text
            style={[
              globalStyles.medium,
              {color: COLORS.light_blue, fontWeight: '600'},
            ]}>
            {userFirstName}
          </Text>
          <Image source={profileIcon} style={styles.header_profile_icon} />
        </TouchableOpacity>
      )}
      {logOutCheck ||
        (false && ( // editing ke case mein or symbol aur false condition remove krni hai
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              display: hideProfileSection ? 'none' : 'flex',
            }}>
            {/* onPress={() => {
          logoutAlert();
        }}> */}
            {/* <Text
          style={[
            globalStyles.medium,
            {color: COLORS.light_blue, fontWeight: '600'},
          ]}>
          {userFirstName}
        </Text> */}
            <Image
              source={userIcon}
              style={styles.header_profile_logout_icon}
            />
          </View>
        ))}
    </View>
  );
};
export default HeaderWithText;
