import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Linking,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {SCREEN_WIDTH} from '../../../constants';
import Header from '../../../global-components/header';
import styles from '../styles';
import globalStyles from '../../../global-styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HeaderWithText from '../../../global-components/header/HeaderWithText';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';
import ScreenWrapperWithHeader from '../../../components/wrappers/screen_wrapper_with_header';
import {
  Camera,
  getCameraPermissionsAsync,
  requestCameraPermissionsAsync,
} from 'expo-camera';
import {PermissionContext} from '../../../context/permissions-context';
import AlertModal from '../../../modals/AlertModal';

const servePracticeImage = require('../../../assets/images/serve_icon.png');
const practiceWithBall = require('../../../assets/images/ballMachine_icon.png');

type Props = {
  navigation: any;
};

const HomeScreen: FunctionComponent<Props> = ({navigation}) => {
  const {
    setCameraPermissions,
    setGalleryPermissions,
    setRecordigPermissions,
    setCameraPermissionsStatus,
    isGalleryPermissions,
    isRecordingPermissions,
    resetPermissions,
  } = React.useContext(PermissionContext);

  const [alertModalVisible, setAlertVisibleModal] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [requested, setRequested] = useState(false);
  const [permissionsStatus, setPermissionsStatus] = useState('unknown');
  const getCameraPermissions = () => {
    setRequested(true);
    console.log('get camera permissions');
    getCameraPermissionsAsync()
      .then(promise => {
        setPermissionsStatus(promise.status);
      })
      .catch(error => {
        Alert.alert('Something went wrong while fetching camera permissions.');
      });

    console.log('Home screen:', SCREEN_WIDTH);
  };

  const requtesCameraPermissions = () => {
    console.log('request camera permissions');
    requestCameraPermissionsAsync()
      .then(promise => {
        setPermissionsStatus(promise.status);
        console.log('camera permissions status, ', promise);
        if (promise.status === 'granted') {
          setCameraPermissions(true);
          console.log('camera permission done', promise.status);
        } else if (promise.status === 'denied') {
          console.log('camera permission done', promise.status);
          setCameraPermissions(false);
          showCameraPermissionsModal();
        } else if (promise.status === 'undetermined') {
          requtesCameraPermissions();
        }
      })
      .catch(error => {
        Alert.alert(
          'Something went wrong while requesting camera permissions.',
        );
      });

    console.log('Home screen:', SCREEN_WIDTH);
  };

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
    console.log('cameraPermissionsStatus, ', permissionsStatus);
    if (permissionsStatus === 'unknown') {
      getCameraPermissions();
    }
    if (permissionsStatus === 'undetermined') {
      requtesCameraPermissions();
    } else if (permissionsStatus === 'denied') {
      showCameraPermissionsModal();
    } else if (permissionsStatus === 'granted') {
      startScreenRecording();
    }
  }, [permissionsStatus]);

  const showCameraPermissionsModal = () => {
    setAlertVisibleModal(true);
    setTitleText('Camera Permission Denied');
    setDescText('Please check camera permission from iPhone settings');
    setButtonText('Go to Settings');
  };
  const goSettings = () => {
    Linking.openSettings();
  };

  const navigateServePracticeHomeScreen = () => {
    console.log('cameraPermissionsStatus, ', permissionsStatus);
    if (permissionsStatus === 'unknown') {
      getCameraPermissions();
    }
    if (permissionsStatus === 'undetermined') {
      requtesCameraPermissions();
    } else if (permissionsStatus === 'denied') {
      showCameraPermissionsModal();
    } else if (permissionsStatus === 'granted') {
      RecordScreen.stopRecording();
      navigation.navigate('ServePracticeHomeScreen');
    }
  };

  const navigateBallMachinePracticeHomeScreen = () => {
    console.log('cameraPermissionsStatus, ', permissionsStatus);
    if (permissionsStatus === 'unknown') {
      getCameraPermissions();
    }
    if (permissionsStatus === 'undetermined') {
      requtesCameraPermissions();
    } else if (permissionsStatus === 'denied') {
      showCameraPermissionsModal();
    } else if (permissionsStatus === 'granted') {
      RecordScreen.stopRecording();
      navigation.navigate('BallMachinePracticeHomeScreen');
    }
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
                Practice Volley / Ball Machine
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
    </ScreenWrapperWithHeader>
  );
};

export default HomeScreen;
