import React, {useEffect, useState, FunctionComponent} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Alert,
  Text,
  Button,
} from 'react-native';
import {DemoTitle, DemoButton, DemoResponse} from '../components';
import {addVideoService} from '../../../../services/servePracticeServices';
import {
  uploadPhotoService,
  uploadVideoService,
  getThumbnailURL,
} from '../../../../services/mediaServices';
import * as ImagePicker from 'react-native-image-picker';
import {add} from '@tensorflow/tfjs-core/dist/engine';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles_external from '../../styles';
import AnimatedLoader from 'react-native-animated-loader';
import {PrimaryButton} from '../../../../components/buttons';
import {useMediaUpload} from '../../../../hooks/useMediaUpload';
import {useAnalysisUpload} from '../../../../hooks';
/* toggle includeExtra */
const includeExtra = true;

type Props = {
  navigation: any;
};
const UploadServePracticeScreenHook: FunctionComponent<Props> = props => {
  const {navigation} = props;
  const [response, setResponse] = React.useState<any>(null);
  const [thumbnail, setThumbnail] = React.useState<any>(null);
  const [videoURL, setVideoURL] = React.useState<string>(null);
  const [videoData, setVideoData] = React.useState<string>(null);

  const {
    uploading,
    uploadThumbnail,
    uploadVideo,
    cancelUploading,
    thumbnailURL,
    currentStatus,
    uploadThumbnailFailure,
    uploadVideoFailure,
  } = useMediaUpload({image: thumbnail});

  const {
    videoAnalysisData,
    uploadingAnalysis,
    addVideoAnalysisToFirebase,
    currentAnalysisStatus,
  } = useAnalysisUpload({videoData: videoData});

  useEffect(() => {
    if (uploadThumbnailFailure) {
      Alert.alert('Could not upload thumbnail');
    }
    if (thumbnailURL) {
      (() => {
        uploadVideo(thumbnail);
      })();
    }
  }, [thumbnailURL, uploadThumbnailFailure]);

  useEffect(() => {
    if (uploadThumbnailFailure) {
      Alert.alert('Could not upload video');
    }
    if (videoURL) {
      (() => {
        let res = thumbnail;
        const videoMetadata = {
          ...res,
          thumbnailURL: thumbnailURL,
          videoURL: videoURL,
        };
        setVideoData(videoMetadata);
      })();
    }
  }, [videoURL, uploadVideoFailure]);

  useEffect(() => {
    if (videoAnalysisData) {
      (() => {
        navigation.navigate('VideoPlayerContainer', {video: videoAnalysisData});
        Alert.alert('Trainify', `Video added successfully.`);
      })();
    }
  }, [videoAnalysisData]);

  const handleSelectVideo = (res?: any) => {
    if (res && res.assets) {
      setResponse(res);
      setThumbnail(res.assets[0]);
      // proceedToUploadThumbnail(res);
      // proceedToUploadVideo();
    } else {
      Alert.alert('Could not fetch file.');
    }
  };

  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, handleSelectVideo);
    } else {
      ImagePicker.launchImageLibrary(options, handleSelectVideo);
    }
  }, []);

  return (
    <SafeAreaView style={styles_external.main_view}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <HeaderWithText
          text="Upload Serve Practice Hook"
          navigation={navigation}
        />
        <AnimatedLoader
          visible={uploading || uploadingAnalysis}
          overlayColor={'rgba(255, 255, 255, 0.75)'}
          source={require('./loader.json')}
          animationStyle={styles.lottie}
          speed={1}>
          <Text>
            {uploading
              ? currentStatus
              : uploadingAnalysis
              ? currentAnalysisStatus
              : false}
          </Text>
          <Button title={'Cancel upload'} onPress={() => cancelUploading()} />
        </AnimatedLoader>

        <ScrollView>
          <View style={styles.buttonContainer}>
            {actions.map(({title, type, options}) => {
              return (
                <DemoButton
                  key={title}
                  onPress={() => onButtonPress(type, options)}>
                  {title}
                </DemoButton>
              );
            })}
          </View>
          <DemoResponse>
            {response && response?.assets && response.assets[0]}
          </DemoResponse>

          <DemoResponse>
            {thumbnailURL && `Thumbnail URL: ${thumbnailURL}`}
          </DemoResponse>

          <DemoResponse>{videoURL && `Video URL: ${videoURL}`}</DemoResponse>

          {response?.assets &&
            response?.assets.map(({uri}) => (
              <View key={uri} style={styles.image}>
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={{width: 200, height: 200}}
                  source={{uri: uri}}
                />
              </View>
            ))}
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export default UploadServePracticeScreenHook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },

  image: {
    marginVertical: 24,
    alignItems: 'center',
  },

  cameraTypeSwitcher: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 180,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Take Video',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: 'Select Video',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: `Select Image or Video\n(mixed)`,
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'mixed',
      includeExtra,
    },
  },
];
