import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Platform,
  Alert,
  Button,
  Image,
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
import {IconButton} from '../../components/buttons';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';
import * as VideoThumbnails from 'expo-video-thumbnails';

import {
  uploadPhotoService,
  uploadVideoService,
  getThumbnailURL,
} from '../../services/mediaServices';
import AnimatedLoader from 'react-native-animated-loader';

const languagePic = require('../../assets/images/language-pic.png');
const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const startIcon = require('./../../assets/images/icon_record_start.png');
const stopIcon = require('./../../assets/images/icon_record_stop.png');
const uploadAnimation = require('./../../assets/animations/uploading-animation.json');

import {useMediaUpload} from '../../hooks/useMediaUpload';
import {useAnalysisUpload} from '../../hooks';

type Props = {
  navigation: any;
  route: any;
};

const UploadServeContainerHook: FunctionComponent<Props> = props => {
  const {navigation, route} = props;
  const {capturedVideoURI} = route.params;
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);
  const [response, setResponse] = React.useState<any>(null);
  const [thumbnailData, setThumbnailData] = React.useState<any>(null);
  const [videoData, setVideoData] = React.useState(null);
  const [videoMetaData, setVideoMetaData] = React.useState(null);
  const [videoURI, setVideoURI] = useState(null);
  const [thumbnailURI, setThumbnailURI] = useState(null);

  const {
    uploading,
    uploadThumbnail,
    uploadVideo,
    cancelUploading,
    videoURL,
    thumbnailURL,
    currentStatus,
    uploadThumbnailFailure,
    uploadVideoFailure,
  } = useMediaUpload({videoData: videoData});

  const {
    videoAnalysisData,
    uploadingAnalysis,
    addVideoAnalysisToFirebase,
    currentAnalysisStatus,
  } = useAnalysisUpload({videoMetaData: videoMetaData});

  useEffect(() => {
    if (capturedVideoURI) {
      // Alert.alert(capturedVideoURI);
      const uri = capturedVideoURI;
      proceedToUploadVideo(capturedVideoURI);
    }
  }, [capturedVideoURI]);

  useEffect(() => {
    if (uploadVideoFailure) {
      Alert.alert('Could not upload thumbnail');
    }
    if (videoURL) {
      (() => {
        proceedToUploadThumbnail();
      })();
    }
  }, [videoURL, uploadVideoFailure]);

  useEffect(() => {
    if (uploadThumbnailFailure) {
      Alert.alert('Could not upload video');
    }
    if (thumbnailURL) {
      // Alert.alert('Thumbnail uploaded, ', thumbnailURL);
      (() => {
        proceedToUploadMetaData();
      })();
    }
  }, [thumbnailURL, uploadThumbnailFailure]);

  useEffect(() => {
    if (videoAnalysisData) {
      navigation.replace('VideoPlayerContainer', {video: videoAnalysisData});
      Alert.alert('Trainify', `Video added successfully.`);
    }
  }, [videoAnalysisData]);

  const proceedToUploadMetaData = async () => {
    var analysis_data = {
      labels: ['Flat', 'Kick', 'Slice'],
      legend: ['A', 'B', 'C', 'D'],
      data: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      barColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
    };
    var last = capturedVideoURI.substring(
      capturedVideoURI.lastIndexOf('/') + 1,
      capturedVideoURI.length,
    );
    const name = last;
    let videoAnalysisData1 = {
      duration: 0.01,
      fileName: name,
      name: name,
      fileSize: 9363694,
      height: 720,
      id: 'EABE012E-DDBB-4DC9-8F78-E159F198ECFE/L0/001',
      timestamp: '2022-02-25T17:02:18.000+0500',
      type: 'video/quicktime',
      videoURI: videoURI ? videoURI : 'No uri',
      thumbnailURI: thumbnailURI ? thumbnailURI : 'No uri',
      videoURL: videoURL ? videoURL : 'No url',
      thumbnailURL: thumbnailURL ? thumbnailURL : 'No url',
      width: 1280,
      analysisData: analysis_data,
    };
    // Alert.alert('Adding metadata 1');
    addVideoAnalysisToFirebase(videoAnalysisData1);
  };

  const proceedToUploadThumbnail = async () => {
    if (capturedVideoURI) {
      const {uri} = await VideoThumbnails.getThumbnailAsync(capturedVideoURI, {
        time: 200,
      });
      try {
        await CameraRoll.save(uri, {type: 'photo', album: 'TrainfyApp'});
      } catch (error) {
        Alert.alert('Failed to save thumbnail in gallery');
      }
      var last = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
      const name = last;
      // data for thumbnail
      const imageData = {
        name: name,
        uri: uri,
        type: 'image/jpg',
      };
      setThumbnailURI(uri);
      setThumbnailData(imageData);
      uploadThumbnail(imageData);
    }
  };

  const proceedToUploadVideo = async url => {
    var last = url.substring(url.lastIndexOf('/') + 1, url.length);
    const name = last;
    let videoData1 = {
      name: name,
      uri: url,
      type: 'video/mp4',
    };
    console.log('videoData for uploading:', JSON.stringify(videoData1));
    setVideoData(videoData1);
    uploadVideo(videoData1);
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
          setVideoURI(url);
          proceedToUploadVideo(url);
        }
      })
      .catch(error => console.log('error...: ', error));
  };

  const handleStartCamera = () => {
    startRecording();
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
          <AnimatedLoader
            visible={uploading || uploadingAnalysis}
            overlayColor={'rgba(255, 255, 255, 0.75)'}
            source={uploadAnimation}
            animationStyle={styles.lottie}
            speed={1}>
            <Text>
              {uploading
                ? currentStatus
                : uploadingAnalysis
                ? currentAnalysisStatus
                : false}
            </Text>
            <Button
              title={'Cancel upload'}
              onPress={() => {
                cancelUploading();
                navigation.goBack();
              }}
            />
          </AnimatedLoader>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
export default UploadServeContainerHook;
