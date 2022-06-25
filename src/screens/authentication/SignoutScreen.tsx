import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
// Custom UI components.
import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants';
const avatarIcon = require('../../assets/images/avatar.png');

import {AuthContext} from './../../context/auth-context';
import ScreenWrapperWithHeader from '../../components/wrappers/screen_wrapper_with_header';
import {logoutService} from '../../services/authenticationServices';
import RNRestart from 'react-native-restart'; // Import package from node modules
import LogoutAlertModal from '../../modals/LogoutAlerModal';

type Props = {
  navigation?: any;
  route?: any;
};

const SignoutScreen: FunctionComponent<Props> = props => {
  const {navigation, route} = props;
  const [logOutCheck, setLogOutCheck] = useState(false);
  const [deleteAccountCheck, setDeleteAccountCheck] = useState(false);
  const {
    authUser,
    authObject,
    setAuthUser: setUser,
    logoutUser,
  } = React.useContext(AuthContext);
  const [userName, setUserName] = useState('User');
  useEffect(() => {
    if (authObject) {
      setUserName(`${authObject.firstName} ${authObject.lastName}`);
    }
  }, [authUser, authObject]);
  const logoutSuccess = (userCredential?: any) => {
    console.log('Logout sucess from firebase');
    logoutUser();
    RNRestart.Restart();
  };

  const logoutFailure = error => {
    console.log('Error in logout from firebase');
    logoutUser();
    RNRestart.Restart();
  };

  const proceedToLogout = () => {
    logoutService(logoutSuccess, logoutFailure);
  };

  return (
    <ScreenWrapperWithHeader
      title="Account"
      navigation={navigation}
      route={route}
      logoutcheck={true}>
      <View style={[styles.home_main_view]}>
        <View style={{marginTop: 64}}>
          <View>
            <View
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 8,
              }}>
              <Image
                source={avatarIcon}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
              <Text
                style={[
                  styles.record_and_upload_text,
                  {color: '#000000', marginTop: 32},
                ]}>
                {userName}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'column',
            marginTop: '44%',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            delayPressIn={0}
            onPress={() => {
              setLogOutCheck(true);
              setDeleteAccountCheck(false);
            }}>
            <View
              style={{
                borderWidth: 2,
                borderRadius: 20,
                backgroundColor: '#008EC1',
                borderColor: '#008EC1',
                display: 'flex',
                flex: 1,
                paddingVertical: 32,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text style={[styles.record_and_upload_text, {color: '#FFFFFF'}]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            delayPressIn={0}
            style={{marginTop: 32}}
            onPress={() => {
              setDeleteAccountCheck(true);
              setLogOutCheck(false);
            }}>
            <View
              style={{
                borderWidth: 2,
                borderRadius: 20,
                borderColor: '#FF4E4E',
                display: 'flex',
                flex: 1,
                paddingVertical: 32,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.record_and_upload_text]}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {deleteAccountCheck && (
        <LogoutAlertModal
          visible={deleteAccountCheck}
          textTitle={'DELETE ACCOUNT'}
          textDesc={'Delete Your Account'}
          buttonTitle={'Delete'}
          onCancelButton={() => setDeleteAccountCheck(false)}
          onAcceptButton={() => proceedToLogout()}
        />
      )}
      {logOutCheck && (
        <LogoutAlertModal
          visible={logOutCheck}
          textTitle={'Logout'}
          textDesc={'Logout from your account'}
          buttonTitle={'Logout'}
          onCancelButton={() => setLogOutCheck(false)}
          onAcceptButton={() => proceedToLogout()}
        />
      )}
    </ScreenWrapperWithHeader>
  );
};
export default SignoutScreen;

const styles = StyleSheet.create({
  home_main_view: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? (SCREEN_WIDTH / 100) * 2 : 10,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    minHeight: '100%',
  },
  record_and_upload_text: {
    lineHeight: 22,
    fontWeight: 'normal',
    color: '#FF4E4E',
    textAlign: 'left',
    textAlignVertical: 'bottom',
    fontSize: 18,
  },
});
