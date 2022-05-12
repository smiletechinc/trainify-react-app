import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Platform,
  Alert,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Animated,
  Pressable,
  ImageBackground,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {GooglePay} from 'react-native-google-pay';

// Custom UI components.
import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants';
import AppUserItem from './components/AppUserItem';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

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
import HeaderWithText from '../../global-components/header/HeaderWithText';
import ScreenWrapperWithHeader from '../../components/wrappers/screen_wrapper_with_header';
import ProcessingModal from '../../modals/ProcessingModal';
import {current} from '@reduxjs/toolkit';
import * as Progress from 'react-native-progress';
import {Background} from 'victory-native';

type Props = {
  navigation: any;
  route: any;
};

const UploadBallMachineContainerHook: FunctionComponent<Props> = props => {
  useKeepAwake();
  const {navigation, route} = props;
  const {capturedVideoURI, graphData, createrId} = route.params;
  // console.log(createrId);
  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);
  const [response, setResponse] = React.useState<any>(null);
  const [thumbnailData, setThumbnailData] = React.useState<any>(null);
  const [videoData, setVideoData] = React.useState(null);
  const [videoMetaData, setVideoMetaData] = React.useState(null);
  const [videoURI, setVideoURI] = useState(null);
  const [thumbnailURI, setThumbnailURI] = useState(null);
  const [uploadingText, setUploadingText] = useState(null);
  // const [percentage, setPercentage] = useState(0);
  const [prograssValue, setProgressValue] = useState(0);
  const [indeterminate, setIndeterminate] = useState(true);

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
      setVideoURI(capturedVideoURI);
      proceedToUploadVideo(capturedVideoURI);
    }
  }, [capturedVideoURI]);

  useEffect(() => {
    if (uploadVideoFailure) {
      Alert.alert('Could not upload video');
    }
    if (videoURL) {
      (() => {
        proceedToUploadThumbnail();
      })();
    }
  }, [videoURL, uploadVideoFailure]);

  useEffect(() => {
    if (uploadThumbnailFailure) {
      Alert.alert('Could not upload Thumbnail');
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
      navigation.navigate('BallPracticeVideoPlayer', {
        video: videoAnalysisData,
      });
      // Alert.alert('Trainify', `Video added successfully.`);
    }
  }, [videoAnalysisData]);

  const proceedToUploadMetaData = async () => {
    animate();
    var analysis_data = {
      labels: ['Forehand', 'Backhand'],
      legend: ['A', 'B', 'C', 'D'],
      data: graphData
        ? graphData
        : [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ],
      barColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
    };
    var last = capturedVideoURI.substring(
      capturedVideoURI.lastIndexOf('/') + 1,
      capturedVideoURI.length,
    );
    let date = new Date().toDateString();
    const name = last;
    let videoAnalysisData1 = {
      duration: 0.01,
      fileName: name,
      name: name,
      fileSize: 9363694,
      height: 720,
      id: 'EABE012E-DDBB-4DC9-8F78-E159F198ECFE/L0/001',
      timestamp: date,
      type: 'video/quicktime',
      videoURI: videoURI ? videoURI : 'No uri',
      thumbnailURI: thumbnailURI ? thumbnailURI : 'No uri',
      videoURL: videoURL ? videoURL : 'No url',
      thumbnailURL: thumbnailURL ? thumbnailURL : 'No url',
      width: 1280,
      analysisData: analysis_data,
      createrId: createrId,
    };
    // Alert.alert('Adding metadata 1');
    addVideoAnalysisToFirebase(videoAnalysisData1, 'ballMachinePracticeVideos');
  };

  const proceedToUploadThumbnail = async () => {
    animate();
    if (capturedVideoURI) {
      const {uri} = await VideoThumbnails.getThumbnailAsync(capturedVideoURI, {
        time: 200,
      });
      var last = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
      const name = last;
      // data for thumbnail
      const imageData = {
        name: name,
        uri: uri,
        type: 'image',
      };
      setThumbnailURI(uri);
      setThumbnailData(imageData);
      uploadThumbnail(imageData);
    }
  };

  const proceedToUploadVideo = async url => {
    animate();
    var last = url.substring(url.lastIndexOf('/') + 1, url.length);
    const name = last;
    let videoData1 = {
      name: name,
      uri: url,
      type: 'video',
    };
    console.log('videoData for uploading:', JSON.stringify(videoData1));
    setVideoData(videoData1);
    uploadVideo(videoData1);
  };
  const uplodaingCancel = () => {
    cancelUploading();
    navigation.goBack();
  };

  useEffect(() => {
    if (uploading) {
      setUploadingText(currentStatus);
    } else if (uploadingAnalysis) {
      setUploadingText(currentAnalysisStatus);
    } else {
      setUploadingText('Uploaded Done');
    }
  });

  const animate = () => {
    let progress = 0;
    setProgressValue(progress);
    setTimeout(() => {
      setIndeterminate(false);
      setInterval(() => {
        progress += Math.random() / 5;
        if (progress > 1) {
          progress = 1;
        }
        setProgressValue(progress);
      }, 500);
    }, 1500);
  };

  return (
    <ScreenWrapperWithHeader title="uploading" navigation={navigation}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingVertical: 20,
        }}>
        <ImageBackground
          source={languagePic}
          style={{width: '100%', height: '100%'}}
        />
        {/* <AutoHeightImage source={languagePic} width={SCREEN_HEIGHT * 0.65} /> */}
        <Text style={{fontSize: 20, textAlign: 'center', margin: 10}}>
          {uploadingText}
        </Text>
        <View>
          <Progress.Bar
            style={{margin: 10}}
            progress={prograssValue}
            indeterminate={indeterminate}
          />
        </View>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => uplodaingCancel()}>
          <Text style={styles.textStyle1}>Cancel</Text>
        </Pressable>
      </View>
    </ScreenWrapperWithHeader>
  );
};
export default UploadBallMachineContainerHook;
