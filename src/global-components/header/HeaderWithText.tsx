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
import {RootState} from '../../redux/state';
import {connect, useSelector} from 'react-redux';
import {logoutService} from '../../services/authenticationServices';
import RNRestart from 'react-native-restart'; // Import package from node modules
import {UserObject} from '../../types';
import {userstatus} from '../../redux/action/userAction';

const profileIcon = require('../../assets/images/profile-icon.png');
const backIcon = require('../../assets/images/back-icon.png');

type Props = {
  text: string;
  hideProfileSection?: boolean;
  navigation: any;
  hideBackButton?: boolean;
  add?: any;
};
const HeaderWithText: FunctionComponent<Props> = props => {
  // const navigation = useNavigation();
  const [userFirstName, setuserFirstName] = useState('User');
  // const UserData = useSelector((state: RootState) => state.routing.authUser);
  const {text, hideProfileSection, navigation, hideBackButton, add} = props;

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
    Alert.alert(
      'Alert  ',
      'Are you sure to logout ',
      [
        {text: 'Close', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Logout', onPress: proceedToLogout},
      ],
      {cancelable: false},
    );
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
    const userAuth: UserObject = {
      id: 'null',
      email: 'null',
      playerstyle: 'null',
      gender: 'male',
      height: 'null',
      birthday: 'null',
      location: 'null',
      rating: 'null',
      nationality: 'null',
      firstName: 'null',
      middleName: 'null',
      lastName: 'null',
      userType: 'null',
      paymentPlan: 'null',
    };
    add(userAuth);
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
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  console.log('Adding a user in Redux');
  return {
    add: user => {
      dispatch(userstatus(user));
    },
  };
};

export default connect(null, mapDispatchToProps)(HeaderWithText);
