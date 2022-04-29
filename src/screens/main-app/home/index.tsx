import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import styles from '../styles';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';
import ScreenWrapperWithHeader from '../../../components/wrappers/screen_wrapper_with_header';
import AlertModal from '../../../modals/AlertModal';
import {useeCameraPermissionsHook} from '../../../hooks';
import {getDownloadURL} from 'firebase/storage';
// import * as MediaLibrary from 'expo-media-library';
import {usePermissions} from 'expo-media-library';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {AuthContext} from '../../../context/auth-context';

const servePracticeImage = require('../../../assets/images/serve_icon.png');
const practiceWithBall = require('../../../assets/images/ballMachine_icon.png');

type Props = {
  navigation: any;
};

const HomeScreen: FunctionComponent<Props> = ({navigation}) => {
  useKeepAwake();
  const {getCameraPermission, requestCameraPermission, permissionStatus} =
    useeCameraPermissionsHook();
  const [alertModalVisible, setAlertVisibleModal] = useState(false);
  const [alertBallMachineNavigationModal, setAlertBallMachineNavigationModal] =
    useState(false);
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [status, requestPermission] = usePermissions();
  const [galleryPermission, setGalleryPermission] = useState(false);
  const [userPaymentPlan, setUserPaymentPlan] = useState('User');

  const {
    authUser,
    authObject,
    setAuthUser: setUser,
    logoutUser,
  } = React.useContext(AuthContext);

  useEffect(() => {
    if (authObject) {
      console.log('authObject ', authObject);
      const {paymentPlan} = authObject;
      setUserPaymentPlan(paymentPlan);
    }
    if (authUser) {
      console.log('authUser ', authUser);
    }
  }, [authUser, authObject]);

  const startScreenRecording = () => {
    RecordScreen.startRecording({mic: false})
      .then(promise => {
        console.log('recording Screen Permission done', promise);
      })
      .catch(error => {
        Alert.alert('Could not started screen recording, ', error);
      });
  };

  useEffect(() => {
    console.log('gallery Permission:', status);
    if (status) {
      console.log('gallery Permission:', status.accessPrivileges);
      if (status.status === 'undetermined') {
        requestPermission();
      } else if (status.accessPrivileges === 'all') {
        setGalleryPermission(true);
      } else if (status.accessPrivileges === 'limited') {
        showGalleryPermiisonModal();
      } else if (
        status.status === 'denied' &&
        status.accessPrivileges === 'none'
      ) {
        // showGalleryPermiisonModal();
      }
    } else {
      requestPermission();
    }
  }, [status]);

  useEffect(() => {
    console.log('cameraPermissionsStatus, ', permissionStatus);
    if (permissionStatus === 'unknown') {
      getCameraPermission();
    }
    if (permissionStatus === 'undetermined') {
      requestCameraPermission();
    } else if (permissionStatus === 'denied') {
      showCameraPermissionsModal();
    } else if (permissionStatus === 'granted') {
      startScreenRecording();
    }
  }, [permissionStatus]);

  const showGalleryPermiisonModal = () => {
    setAlertVisibleModal(true);
    setTitleText('Gallery Permission Denied');
    setDescText('Please Allow the All Permissions of Gallery Permission');
    setButtonText('Go to Settings');
  };

  const showCameraPermissionsModal = () => {
    setAlertVisibleModal(true);
    setTitleText('Camera Permission Denied');
    setDescText('Please check camera permission from iPhone settings');
    setButtonText('Go to Settings');
  };

  const showBallMachineNavigationModal = () => {
    setAlertBallMachineNavigationModal(true);
    setTitleText('Notice');
    setDescText('This feature is available with Premium Subscription only');
  };

  const navigateServePracticeHomeScreen = () => {
    console.log('cameraPermissionsStatus, ', permissionStatus);
    if (permissionStatus === 'unknown') {
      getCameraPermission();
    }
    if (permissionStatus === 'undetermined') {
      requestCameraPermission();
    } else if (permissionStatus === 'denied') {
      showCameraPermissionsModal();
    } else if (permissionStatus === 'granted') {
      RecordScreen.stopRecording();
      requestPermission();
      if (galleryPermission) {
        navigation.navigate('ServePracticeHomeScreen');
      } else {
        showGalleryPermiisonModal();
      }
    }
  };

  const navigateBallMachinePracticeHomeScreen = () => {
    console.log('cameraPermissionsStatus, ', permissionStatus);
    if (permissionStatus === 'unknown') {
      getCameraPermission();
    }
    if (permissionStatus === 'undetermined') {
      requestCameraPermission();
    } else if (permissionStatus === 'denied') {
      showCameraPermissionsModal();
    } else if (permissionStatus === 'granted') {
      RecordScreen.stopRecording();
      requestPermission();
      if (galleryPermission) {
        if (userPaymentPlan === 'Silver') {
          navigation.navigate('BallMachinePracticeHomeScreen');
        } else {
          showBallMachineNavigationModal();
        }
      } else {
        showGalleryPermiisonModal();
      }
    }
  };

  const goSettings = () => {
    Linking.openSettings();
  };

  return (
    <ScreenWrapperWithHeader
      title=""
      navigation={navigation}
      hideBackButton={true}>
      <View style={styles.home_main_view}>
        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 100,
          }}
          onPress={navigateServePracticeHomeScreen}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 30,
              backgroundColor: '#F2994A',
              borderColor: '#F2994A',
              display: 'flex',
              flex: 1,
              paddingBottom: 16,
            }}>
            <View style={{marginLeft: 10}}>
              <Image source={servePracticeImage} style={{margin: 12}} />
              <Text style={styles.practice_text}>Serve Practice</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 50,
          }}
          onPress={navigateBallMachinePracticeHomeScreen}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 30,
              backgroundColor: '#2D9CDB',
              borderColor: '#2D9CDB',
              display: 'flex',
              flex: 1,
              paddingBottom: 8,
            }}>
            <View style={{marginLeft: 10}}>
              <Image source={practiceWithBall} style={{margin: 12}} />
              <Text style={styles.practice_text}>
                Practice Rally / Ball Machine
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {alertModalVisible && (
        <AlertModal
          visible={alertModalVisible}
          title={titleText}
          desc={descText}
          buttonTitle={buttonText}
          onAcceptButton={goSettings}
          onCancelButton={() => setAlertVisibleModal(false)}
        />
      )}

      {alertBallMachineNavigationModal && (
        <AlertModal
          visible={alertBallMachineNavigationModal}
          title={titleText}
          desc={descText}
          onCancelButton={() => setAlertBallMachineNavigationModal(false)}
        />
      )}
    </ScreenWrapperWithHeader>
  );
};

export default HomeScreen;
