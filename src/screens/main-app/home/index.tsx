import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Linking,
} from 'react-native';
import styles from '../styles';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';
import ScreenWrapperWithHeader from '../../../components/wrappers/screen_wrapper_with_header';
import AlertModal from '../../../modals/AlertModal';
import {useeCameraPermissionsHook} from '../../../hooks';

const servePracticeImage = require('../../../assets/images/serve_icon.png');
const practiceWithBall = require('../../../assets/images/ballMachine_icon.png');

type Props = {
  navigation: any;
};

const HomeScreen: FunctionComponent<Props> = ({navigation}) => {
  const {getCameraPermission, requestCameraPermission, permissionStatus} =
    useeCameraPermissionsHook();
  const [alertModalVisible, setAlertVisibleModal] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');
  const [buttonText, setButtonText] = useState('');

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

  const showCameraPermissionsModal = () => {
    setAlertVisibleModal(true);
    setTitleText('Camera Permission Denied');
    setDescText('Please check camera permission from iPhone settings');
    setButtonText('Go to Settings');
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
      navigation.navigate('ServePracticeHomeScreen');
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
      navigation.navigate('BallMachinePracticeHomeScreen');
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
