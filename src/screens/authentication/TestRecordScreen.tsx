import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Platform,
  Alert,
  Button,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {GooglePay} from 'react-native-google-pay';

// Custom UI components.
import {COLORS, SCREEN_WIDTH} from '../../constants';
import AppUserItem from './components/AppUserItem';

// Custom Styles
import globalStyles from '../../global-styles';
import styles from './styles';
import {SimpleButton} from '../../global-components/button';
import {IconButton} from './../../components/buttons';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';

import {
  uploadPhotoService,
  uploadVideoService,
  getThumbnailURL,
} from './../../services/mediaServices';
import AnimatedLoader from 'react-native-animated-loader';

const languagePic = require('../../assets/images/language-pic.png');
const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const startIcon = require('./../../assets/images/icon_record_start.png');
const stopIcon = require('./../../assets/images/icon_record_stop.png');
const uploadAnimation = require('./../../assets/animations/uploading-animation.json');

const TestRecordScreenContainer: FunctionComponent = ({navigation}) => {
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);
  const [uploadingVideo, setUploading] = useState(false);
  const [currentUploadStatus, setStatus] = useState('Processing media');

  const uploadVideoSuccess = (updatedResponse?: any) => {
    Alert.alert('Video uploaded successfuly');
    setUploading(false);
    setStatus('');
    if (updatedResponse) {
      console.log('upload video success: ', JSON.stringify(updatedResponse));
    } else {
      Alert.alert('Error in fetching uploaded video url');
    }
  };

  const uploadVideoFailureFirebase = (error?: any) => {
    setUploading(false);
    setStatus('');
    if (error) {
      Alert.alert('upload video failure in firebase: ', JSON.stringify(error));
    } else {
      Alert.alert('Trainify', `Unknown Error in uploading video.`);
    }
  };

  const proceedToUploadVideo = async url => {
    var last = url.substring(url.lastIndexOf('/') + 1, url.length);
    console.log('URL, ', url);
    console.log('last, ', last);
    const name = last;
    let videoData1 = {
      name: name,
      uri: url,
      type: 'video/mp4',
    };
    console.log('videoData for uploading:', JSON.stringify(videoData1));
    setUploading(true);
    setStatus('Uploading video!');
    await uploadVideoService(
      videoData1,
      uploadVideoSuccess,
      uploadVideoFailureFirebase,
    );
  };

  const startRecording = async () => {
    await RecordScreen.startRecording({mic: false})
      .then(res => {
        setIsRecordingInProgress(true);
        console.log('Video recording started.');
      })
      .catch(error => {
        console.error(error);
        console.log('Video recording could not started.');
      });
  };

  const stopRecording = async () => {
    const responseReocrding = await RecordScreen.stopRecording()
      .then(async res => {
        if (res) {
          console.log('recording stopped:', JSON.stringify(res));
          const url = res.result.outputURL;
          await CameraRoll.save(url, {type: 'video', album: 'TrainfyApp'});
          setIsRecordingInProgress(false);
          // setVideoData(tempVideoData);
          // addVideoService(tempVideoData, addVideoSuccess, addVideoFailure);
          console.log('Recording saved successfuly.');
          proceedToUploadVideo(url);
        }
      })
      .catch(error => console.log('error...: ', error));
  };

  const handleStartCamera = () => {
    // startRecording();
  };

  const handleStopCamera = () => {
    stopRecording();
  };

  return (
    <View style={styles.login_main_container}>
      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            flex: 1,
            marginTop: 47,
            paddingHorizontal: SCREEN_WIDTH * 0.05,
          }}>
          <AutoHeightImage source={languagePic} width={SCREEN_WIDTH * 0.9} />
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: Platform.OS === 'ios' ? 70 : 40,
            }}>
            <View style={styles.recordButtonContainer}>
              {isRecordingInProgress ? (
                <IconButton
                  styles={styles.recordIcon}
                  icon={stopIcon}
                  onPress={handleStopCamera}
                  transparent={true}
                />
              ) : (
                <IconButton
                  styles={styles.recordIcon}
                  icon={startIcon}
                  onPress={handleStartCamera}
                  transparent={true}
                />
              )}
            </View>
          </View>
          <AnimatedLoader
            style={styles.cameraContainer}
            visible={uploadingVideo}
            overlayColor={'rgba(255, 255, 255, 0.75)'}
            source={uploadAnimation}
            animationStyle={styles.lottie}
            speed={1}>
            <Text>{currentUploadStatus}</Text>
            <Button
              title={'Cancel upload'}
              onPress={() => {
                setUploading(false);
                setStatus('Cancelled');
              }}
            />
          </AnimatedLoader>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default TestRecordScreenContainer;
