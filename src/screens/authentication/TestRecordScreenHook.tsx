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
import {IconButton} from './../../components/buttons';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';
import * as VideoThumbnails from 'expo-video-thumbnails';

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

import {useMediaUpload} from '../../hooks/useMediaUpload';
import {useAnalysisUpload} from '../../hooks';

type Props = {
  navigation: any;
  route: any;
};

const TestRecordScreenContainerHook: FunctionComponent<Props> = props => {
  const {navigation, route} = props;
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

  /// Note: To check if video is uploaded or a failure occured
  useEffect(() => {
    if (uploadVideoFailure) {
      Alert.alert('Could not upload thumbnail');
    }
    if (videoURL) {
      (() => {
        // Alert.alert('Video uploaded Successfully');
        // uploadThumbnail(videoData);
        proceedToUploadThumbnail();
      })();
    }
  }, [videoURL, uploadVideoFailure]);

  // useEffect(() => {
  //   if (thumbnailData && thumbnailData.uri) {
  //     (() => {
  //       uploadThumbnail(thumbnailData);
  //       // proceedToUploadThumbnail();
  //     })();
  //   } else {
  //     Alert.alert('Error while uploading thumbnail');
  //   }
  // }, [thumbnailData, uploadThumbnailFailure]);

  useEffect(() => {
    if (uploadThumbnailFailure) {
      Alert.alert('Could not upload video');
    }
    if (videoURL) {
      (() => {
        // Alert.alert('Thumbnail uploaded successfully');
        proceedToUploadMetaData();
      })();
    }
  }, [thumbnailURL, uploadThumbnailFailure]);

  // useEffect(() => {
  //   if (uploadThumbnailFailure) {
  //     Alert.alert('Could not upload video');
  //   }
  //   if (videoURL) {
  //     (() => {
  //       let res = thumbnail;
  //       const videoMetadata = {
  //         ...res,
  //         thumbnailURL: thumbnailURL,
  //         videoURL: videoURL,
  //       };
  //       setVideoData(videoMetadata);
  //     })();
  //   }
  // }, [videoURL, uploadVideoFailure]);

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
    let videoAnalysisData1 = {
      duration: 0.01,
      fileName: '66748333739__C225D81F-7822-4680-BD8E-C66E6A08A53F.mov',
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

    addVideoAnalysisToFirebase(videoAnalysisData1);
  };

  const proceedToUploadThumbnail = async () => {
    const tempVideoURI = videoData.uri;
    const {uri} = await VideoThumbnails.getThumbnailAsync(tempVideoURI, {
      time: 200,
    });
    await CameraRoll.save(uri, {type: 'photo', album: 'TrainfyApp'});
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
        Alert.alert('Video recording could not started.');
      });
  };

  const stopRecording = async () => {
    try {
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
            // Alert.alert('Recording stopped');
            proceedToUploadVideo(url);
          }
        })
        .catch(error => Alert.alert('Error in recording...: ', error));
    } catch (error) {
      Alert.alert('Error in recording #catch: ', error);
    }
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
export default TestRecordScreenContainerHook;
