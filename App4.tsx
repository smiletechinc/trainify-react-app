import React, {useEffect, useState, useRef, FunctionComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import {Camera} from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  bundleResourceIO,
  cameraWithTensors,
} from '@tensorflow/tfjs-react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {ExpoWebGLRenderingContext} from 'expo-gl';
import {CameraType} from 'expo-camera/build/Camera.types';
import {CounterContext} from './src/context/counter-context';
import {addVideoService} from './src/services/servePracticeServices';
import styles_external from './src/screens/main-app/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderWithText from './src/global-components/header/HeaderWithText';
import {IconButton} from './src/components/buttons';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';
import {useAnalysisUpload, useMediaUpload} from './src/hooks';
import {
  uploadPhotoService,
  uploadVideoService,
  getThumbnailURL,
} from './src/services/mediaServices';

const stopIcon = require('./src/assets/images/icon_record_stop.png');
const TensorCamera = cameraWithTensors(Camera);
const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';
const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 3 / 4 : 9 / 16);
const MIN_KEYPOINT_SCORE = 0.3;
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);
const AUTO_RENDER = false;

let cameraLayoutWidth = 120;
let cameraLayoutHeight = 160;

type Props = {
  navigation: any;
  route: any;
};

const App4: FunctionComponent<Props> = props => {
  const [cameraWidth, setCameraWidth] = useState(120);
  const [cameraHeight, setCameraHeight] = useState(160);
  const cameraRef = React.useRef();
  const {navigation, route} = props;
  const {title} = route.params;
  // const title = '';
  const [isLoading, setLoading] = React.useState(true);
  const {increment, reset, count, calibrated, setCalibrated, setData, data} =
    React.useContext(CounterContext);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>();
  const [typeOfServeDetector, setTypeOfServeDetector] =
    useState<tf.LayersModel>();
  const [poses, setPoses] = useState<posedetection.Pose[]>();
  const [fps, setFps] = useState(0);
  const [serveType, setServeType] = useState('');
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>();
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.front,
  );
  const [isCalibratedr, setIsCalibratedr] = useState(false);
  const [isStartedVideoRecording, setIsStartedVideoRecording] = useState(false);
  const [isCalibratedp, setIsCalibratedp] = useState(true);
  const [canAdd, setCanAdd] = useState(true);
  const [serveGrade, setServeGrade] = useState('');
  const rafId = useRef<number | null>(null);

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

  let skipFrameCount = 0;
  var isCalibrated = false;
  var isCompletedRecording = false;
  let response_let = {};
  let thumbURL = '';
  let vidURL = '';

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
        // navigation.navigate('VideoPlayerContainer', { video: videoAnalysisData });
        // Alert.alert('Trainify', `Video added successfully.`);
      })();
    }
  }, [videoAnalysisData]);

  useEffect(() => {
    async function prepare() {
      rafId.current = null;

      const curOrientation = await ScreenOrientation.getOrientationAsync();
      const model = posedetection.SupportedModels.BlazePose;
      const detectorConfig = {runtime: 'tfjs', modelType: 'full'};
      const detector = await posedetection.createDetector(
        model,
        detectorConfig,
      );
      const model_json = await require('./src/assets/model/model.json');
      const model_weight = await require('./src/assets/model/group1-shard.bin');
      const model_tos = await tf.loadLayersModel(
        bundleResourceIO(model_json, model_weight),
      );

      setOrientation(curOrientation);
      setModel(detector);
      console.log('Loading Type of Serve Model');
      setTypeOfServeDetector(model_tos);
      setTfReady(true);
      setLoading(false);
      // startRecording();
      ScreenOrientation.addOrientationChangeListener(event => {
        setOrientation(event.orientationInfo.orientation);
      });

      await Camera.requestCameraPermissionsAsync();

      await tf.ready();
      // Following is just to check if the screen recording uploading is working by customly recording the video for 3 seconds.
      // startRecording();
      // setTimeout(() => {
      //   console.log('stopped: ');
      //   stopRecording();
      // }, 8000);

      let test_pose = [
        0.594638705, 0.369584292, 0.999754488, 0.589969754, 0.358422577,
        0.999666452, 0.588887513, 0.358062506, 0.999462545, 0.587873518,
        0.357742667, 0.999691844, 0.591217399, 0.359721988, 0.999851108,
        0.591017306, 0.360155702, 0.999814451, 0.590846598, 0.360536039,
        0.999869704, 0.581021726, 0.365049869, 0.9995116, 0.584779084,
        0.367410958, 0.999774396, 0.592306018, 0.379502505, 0.9993698,
        0.593814075, 0.380981237, 0.999513149, 0.572292209, 0.422788471,
        0.996126115, 0.584866822, 0.427995265, 0.999579489, 0.599811494,
        0.359128565, 0.246059641, 0.621611774, 0.418727636, 0.990606666,
        0.616181195, 0.287944049, 0.565571725, 0.65847981, 0.361873239,
        0.978898168, 0.61689496, 0.270983219, 0.604153454, 0.674021482,
        0.354280949, 0.970035493, 0.616020381, 0.269142509, 0.613040745,
        0.672619522, 0.345904052, 0.966704667, 0.615653872, 0.277275503,
        0.620513439, 0.668362796, 0.34725973, 0.942334592, 0.588169515,
        0.619173229, 0.999692798, 0.591820598, 0.628406227, 0.999647498,
        0.591561019, 0.730128884, 0.550906718, 0.595847547, 0.746534765,
        0.963611364, 0.570897996, 0.846207023, 0.711334169, 0.574136496,
        0.867012799, 0.979639292, 0.561005652, 0.865304351, 0.803088844,
        0.56385833, 0.886849761, 0.973807216, 0.600462675, 0.870158613,
        0.800599277, 0.607367218, 0.892697453, 0.967935383,
      ];
    }
    prepare();
  }, []);

  useEffect(() => {
    return () => {
      RecordScreen.clean();
      reset();
      setCalibrated(false);
      if (rafId.current != null && rafId.current !== 0) {
        reset();
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };
  }, []);

  // const addVideoToFirebase = () => {

  //   let videoData = {
  //     duration: 9.01,
  //      fileName: "66748333739__C225D81F-7822-4680-BD8E-C66E6A08A53F.mov",
  //     fileSize: 9363694,
  //     height: 720,
  //     id: "EABE012E-DDBB-4DC9-8F78-E159F198ECFE/L0/001",
  //      timestamp: "2022-02-25T17:02:18.000+0500",
  //      type: "video/quicktime",
  //      uri: "file:///var/mobile/Containers/Data/Application/4EC5C8B3-E530-4B35-83A8-49C844AA23DA/tmp/66748333739__C225D81F-7822-4680-BD8E-C66E6A08A53F.mov",
  //      width: 1280
  //     }

  //     const tempAnalysisData = {
  //       labels: ["Flat", "Kick", "Slice"],
  //       legend: ["A", "B", "C", "D"],
  //       data:data,
  //       barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
  //     };

  //   const tempVideoData = {...videoData, analysisData: tempAnalysisData}

  //   console.log('analysis_data for firebase, ', JSON.stringify(data));
  //   console.log('sending to firebase, ', JSON.stringify(tempVideoData));

  //     addVideoService(tempVideoData, addVideoSuccess, addVideoFailure);
  // }

  const Ref = useRef(null);
  const [timer, setTimer] = useState('10000');
  const [timerSeconds, setSeconds] = useState(0);

  const getTimeRemaining = e => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(((total / 1000) * 60 * 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = e => {
    let {total, hours, minutes, seconds} = getTimeRemaining(e);
    if (total >= 0) {
      setSeconds(seconds);
    }
  };

  const clearTimer = e => {
    setSeconds(10);

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  };

  useEffect(() => {
    // RecordScreen.setup();
    clearTimer(getDeadTime());
  }, []);

  useEffect(() => {
    setCalibrated(calibrated);
  }, [calibrated]);

  useEffect(() => {
    if (timerSeconds >= 2) {
      setCanAdd(false);
    } else if (timerSeconds < 2) {
      setCanAdd(true);
    }
  }, [timerSeconds]);

  useEffect(() => {
    if (tfReady) {
      clearTimer(getDeadTime());
    }
  }, [tfReady]);

  const addVideoSuccess = (video?: any) => {
    // console.log('Added: ', JSON.stringify(video));
    if (video) {
      navigation.replace('VideoPlayerContainer', {video: video});
    }
    // 0
  };
  const addVideoFailure = (error?: any) => {
    // console.log('Error: ', JSON.stringify(error));
    if (error) {
      Alert.alert('Trainify', `Error in adding video metadata.`);
    }
  };
  const uploadVideoSuccess = (updatedResponse?: any) => {
    setLoading(false);
    Alert.alert('Video uploaded successfully');
    setVideoURL(updatedResponse);
    vidURL = updatedResponse;
    console.log('upload video success: ', JSON.stringify(updatedResponse));
    addVideoToFirebase();
  };

  const addVideoToFirebase = () => {
    // uploadVideoService(response, addVideoSuccess, addVideoFailure);
    let res = response_let;
    const videoMetadata = {
      ...res,
      thumbnailURL: thumbURL,
      videoURL: vidURL,
    };
    console.log('videoMetadata, ', videoMetadata);
    addVideoService(videoMetadata, addVideoSuccess, addVideoFailure);
  };

  const uploadVideoFailureFirebase = (error?: any) => {
    console.log('Error: ', JSON.stringify(error));
    if (error) {
      // Alert.alert('Trainify', `Error in adding video.`);
    }
  };

  const stopRecording = async () => {
    const res = await RecordScreen.stopRecording()
      .then(async res => {
        if (res) {
          console.log('recording stopped:', res);
          const url = res.result.outputURL;
          await CameraRoll.save(url, {type: 'video', album: 'TrainfyApp'});

          // KAZMI Code Starts here.

          let videoData1 = {
            name: 'screen_recording_1.mp4',
            uri: url,
            type: 'video/mp4',
          };
          await uploadVideoService(
            videoData1,
            uploadVideoSuccess,
            uploadVideoFailureFirebase,
          );

          // Kazmi code Ends here
          console.log('Recording detials:', JSON.stringify(res));
          console.log('REOCORDING STOPPED: ', url);

          let videoData = {
            duration: 0.01,
            fileName: '66748333739__C225D81F-7822-4680-BD8E-C66E6A08A53F.mov',
            fileSize: 9363694,
            height: 720,
            id: 'EABE012E-DDBB-4DC9-8F78-E159F198ECFE/L0/001',
            timestamp: '2022-02-25T17:02:18.000+0500',
            type: 'video/quicktime',
            uri: url,
            width: 1280,
          };
          const tempAnalysisData = {
            labels: ['Flat', 'Kick', 'Slice'],
            legend: ['A', 'B', 'C', 'D'],
            data: data,
            barColors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
          };
          const tempVideoData = {...videoData, analysis_data: tempAnalysisData};
          console.log('analysis_data for firebase, ', JSON.stringify(data));
          console.log('sending to firebase, ', JSON.stringify(tempVideoData));
          response_let = tempVideoData;

          setVideoData(tempVideoData);

          // addVideoService(tempVideoData, addVideoSuccess, addVideoFailure);
        }
      })
      .catch(error => console.log('error...: ', error));
  };

  const handleStopCamera = () => {
    isCompletedRecording = true;
    stopRecording();
  };

  const handleSwitchCameraType = () => {
    if (cameraType === Camera.Constants.Type.back) {
      setCameraType(Camera.Constants.Type.front);
    } else {
      setCameraType(Camera.Constants.Type.back);
    }
  };

  const renderCameraTypeSwitcher = () => {
    return (
      <View
        style={styles.cameraTypeSwitcher}
        onTouchEnd={handleSwitchCameraType}>
        <Text>
          Switch to{' '}
          {cameraType === Camera.Constants.Type.back ? 'front' : 'back'} camera
        </Text>
      </View>
    );
  };

  const startRecording = async () => {
    await RecordScreen.startRecording({mic: false})
      .then(res => {
        setIsStartedVideoRecording(true);
        console.log('Video recording started.');
      })
      .catch(error => {
        console.error(error);
        console.log('Video recording could not started.');
      });
  };

  const renderCalibration = () => {
    let text;
    if (isCalibratedr) {
      text = (
        <Text>You are calibrated. Please dont move recording is starting.</Text>
      );
    } else {
      text = (
        <Text>
          Please callibrate your self so that your whole body is visible.
        </Text>
      );
    }
    return <View style={styles.calibrationContainer}>{text}</View>;
  };

  const renderCalibrationPoints = () => {
    // const cx1 = cameraLayoutWidth / 2 - 150;
    // const cy1 = cameraLayoutHeight - 600;

    // const cx2 = cameraLayoutWidth / 2 + 150;
    // const cy2 = cameraLayoutHeight - 600;

    // const cx3 = cameraLayoutWidth / 2 - 150;
    // const cy3 = cameraLayoutHeight - 100;

    // const cx4 = cameraLayoutWidth / 2 + 150;
    // const cy4 = cameraLayoutHeight - 100;

    const cx1 = 100;
    const cy1 = 100;

    const cx2 = cameraLayoutWidth - 100;
    const cy2 = 100;

    const cx3 = 100;
    const cy3 = cameraLayoutHeight - 50;

    const cx4 = cameraLayoutWidth - 100;
    const cy4 = cameraLayoutHeight - 50;

    // console.log('I amhere');
    // const cx1 = 400;
    // const cy1 = 486;

    // const cx2 = 448;
    // const cy2 = 780;

    // const cx3 = 276;
    // const cy3 = 780;

    // const cx4 = 295;
    // const cy4 = 486;

    if (isCalibratedp) {
      return (
        <Svg style={styles.svg} width={cameraWidth} height={cameraHeight}>
          <Line
            x1={cx1}
            y1={cy1}
            x2={cx2}
            y2={cy2}
            stroke="white"
            strokeWidth="5"
          />
          <Line
            x1={cx1}
            y1={cy1}
            x2={cx3}
            y2={cy3}
            stroke="white"
            strokeWidth="5"
          />
          <Line
            x1={cx2}
            y1={cy2}
            x2={cx4}
            y2={cy4}
            stroke="white"
            strokeWidth="5"
          />
          <Line
            x1={cx3}
            y1={cy3}
            x2={cx4}
            y2={cy4}
            stroke="white"
            strokeWidth="5"
          />
          {/* <Circle
            // key={`skeletonkp_${k.name}`}
            cx={cx1}
            cy={cy1}
            r="30"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={cx2}
            cy={cy2}
            r="30"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />

          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={cx3}
            cy={cy3}
            r="30"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />

          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={cx4}
            cy={cy4}
            r="30"
            strokeWidth="0"
            fill="white"
            stroke="white"
          /> */}
        </Svg>
      );
    } else {
      return <View></View>;
    }
  };

  const isPortrait = () => {
    return (
      orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    );
  };

  const getOutputTensorWidth = () => {
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_WIDTH
      : OUTPUT_TENSOR_HEIGHT;
  };

  const getOutputTensorHeight = () => {
    return isPortrait() || IS_ANDROID
      ? OUTPUT_TENSOR_HEIGHT
      : OUTPUT_TENSOR_WIDTH;
  };

  const renderFps = () => {
    return (
      <View style={styles.fpsContainer}>
        <Text>Total {count}</Text>
        <Text>Last Serve Type {serveType}</Text>
        <Text>Grade {serveGrade}</Text>
      </View>
    );
  };

  const renderSkeleton = () => {
    if (poses != null && poses.length > 0) {
      const keypoints = poses[0].keypoints;

      var leftShoulder = keypoints.filter(function (item: any) {
        return item.name === 'left_shoulder';
      });

      const flipX = IS_ANDROID || cameraType === Camera.Constants.Type.back;
      const lsx = flipX
        ? cameraLayoutWidth - leftShoulder[0].x
        : leftShoulder[0].x;
      const lsy = leftShoulder[0].y;
      const lscx =
        (lsx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const lscy =
        (lsy / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var rightShoulder = keypoints.filter(function (item: any) {
        return item.name === 'right_shoulder';
      });

      const rsx = flipX
        ? cameraLayoutWidth - rightShoulder[0].x
        : rightShoulder[0].x;
      const rsy = rightShoulder[0].y;
      const rscx =
        (rsx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const rscy =
        (rsy / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var leftHip = keypoints.filter(function (item: any) {
        return item.name === 'left_hip';
      });

      const lhx = flipX ? cameraLayoutWidth - leftHip[0].x : leftHip[0].x;
      const lhy = leftHip[0].y;
      const lhcx =
        (lhx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const lhcy =
        (lhy / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var rightHip = keypoints.filter(function (item: any) {
        return item.name === 'right_hip';
      });

      const rhx = flipX ? cameraLayoutWidth - rightHip[0].x : rightHip[0].x;
      const rhy = rightHip[0].y;
      const rhcx =
        (rhx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const rhcy =
        (rhy / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var leftKnee = keypoints.filter(function (item: any) {
        return item.name === 'left_knee';
      });

      const lkx = flipX ? cameraLayoutWidth - leftKnee[0].x : leftKnee[0].x;
      const lky = leftKnee[0].y;
      const lkcx =
        (lkx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const lkcy =
        (lky / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var rightKnee = keypoints.filter(function (item: any) {
        return item.name === 'right_knee';
      });

      const rkx = flipX ? cameraLayoutWidth - rightKnee[0].x : rightKnee[0].x;
      const rky = rightKnee[0].y;
      const rkcx =
        (rkx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const rkcy =
        (rky / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var leftAnkle = keypoints.filter(function (item: any) {
        return item.name === 'left_ankle';
      });

      const lax = flipX ? cameraLayoutWidth - leftAnkle[0].x : leftAnkle[0].x;
      const lay = leftAnkle[0].y;
      const lacx =
        (lax / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const lacy =
        (lay / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var rightAnkle = keypoints.filter(function (item: any) {
        return item.name === 'right_ankle';
      });

      const rax = flipX ? cameraLayoutWidth - rightAnkle[0].x : rightAnkle[0].x;
      const ray = rightAnkle[0].y;
      const racx =
        (rax / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const racy =
        (ray / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var leftElbow = keypoints.filter(function (item: any) {
        return item.name === 'left_elbow';
      });

      const lex = flipX ? cameraLayoutWidth - leftElbow[0].x : leftElbow[0].x;
      const ley = leftElbow[0].y;
      const lecx =
        (lex / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const lecy =
        (ley / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var rightElbow = keypoints.filter(function (item: any) {
        return item.name === 'right_elbow';
      });

      const rex = flipX ? cameraLayoutWidth - rightElbow[0].x : rightElbow[0].x;
      const rey = rightElbow[0].y;
      const recx =
        (rex / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const recy =
        (rey / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var leftThumb = keypoints.filter(function (item: any) {
        return item.name === 'left_wrist';
      });

      const ltx = flipX ? cameraLayoutWidth - leftThumb[0].x : leftThumb[0].x;
      const lty = leftThumb[0].y;
      const ltcx =
        (ltx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const ltcy =
        (lty / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var rightThumb = keypoints.filter(function (item: any) {
        return item.name === 'right_wrist';
      });

      const rtx = flipX ? cameraLayoutWidth - rightThumb[0].x : rightThumb[0].x;
      const rty = rightThumb[0].y;
      const rtcx =
        (rtx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const rtcy =
        (rty / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var nose = keypoints.filter(function (item: any) {
        return item.name === 'nose';
      });

      const nx = flipX ? cameraLayoutWidth - nose[0].x : nose[0].x;
      const ny = nose[0].y;
      const ncx =
        (nx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const ncy =
        (ny / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var leftFoot = keypoints.filter(function (item: any) {
        return item.name === 'left_foot_index';
      });

      const lfx = flipX ? cameraLayoutWidth - leftFoot[0].x : leftFoot[0].x;
      const lfy = leftFoot[0].y;
      const lfcx =
        (lfx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const lfcy =
        (lfy / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      var rightFoot = keypoints.filter(function (item: any) {
        return item.name === 'right_foot_index';
      });

      const rfx = flipX ? cameraLayoutWidth - rightFoot[0].x : rightFoot[0].x;
      const rfy = rightFoot[0].y;
      const rfcx =
        (rfx / cameraLayoutWidth) *
        (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
      const rfcy =
        (rfy / cameraLayoutHeight) *
        (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

      // console.log(lscx, lscy, rscx, rscy);

      const color = 'green';
      const stroke = '2';

      return (
        <Svg
          style={styles.svg}
          height={cameraLayoutHeight}
          width={cameraLayoutWidth}>
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={lscx}
            cy={lscy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={rscx}
            cy={rscy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={lhcx}
            cy={lhcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={rhcx}
            cy={rhcy}
            r="4"
            strokeWidth="2"
            fill="#00AA00"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={lecx}
            cy={lecy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={recx}
            cy={recy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={lkcx}
            cy={lkcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={rkcx}
            cy={rkcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={ltcx}
            cy={ltcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={rtcx}
            cy={rtcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={lacx}
            cy={lacy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={racx}
            cy={racy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />

          <Circle
            // key={`skeletonkp_${k.name}`}
            cx={ncx}
            cy={ncy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />

          <Line
            x1={lscx}
            y1={lscy}
            x2={rscx}
            y2={rscy}
            stroke={color}
            strokeWidth={stroke}
          />
          <Line
            x1={lhcx}
            y1={lhcy}
            x2={rhcx}
            y2={rhcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={rscx}
            y1={rscy}
            x2={rhcx}
            y2={rhcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={lscx}
            y1={lscy}
            x2={lhcx}
            y2={lhcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={lhcx}
            y1={lhcy}
            x2={lkcx}
            y2={lkcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={rhcx}
            y1={rhcy}
            x2={rkcx}
            y2={rkcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={lkcx}
            y1={lkcy}
            x2={lacx}
            y2={lacy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={rkcx}
            y1={rkcy}
            x2={racx}
            y2={racy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={lscx}
            y1={lscy}
            x2={lecx}
            y2={lecy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={rscx}
            y1={rscy}
            x2={recx}
            y2={recy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={lecx}
            y1={lecy}
            x2={ltcx}
            y2={ltcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={recx}
            y1={recy}
            x2={rtcx}
            y2={rtcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={lacx}
            y1={lacy}
            x2={lfcx}
            y2={lfcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={racx}
            y1={racy}
            x2={rfcx}
            y2={rfcy}
            stroke={color}
            strokeWidth={stroke}
          />

          <Line
            x1={ncx}
            y1={ncy}
            x2={(rscx + lscx) / 2}
            y2={(rscy + lscy) / 2}
            stroke={color}
            strokeWidth={stroke}
          />
        </Svg>
      );
    }
  };

  const renderPose = () => {
    if (poses != null && poses.length > 0) {
      const keypoints = poses[0].keypoints
        .filter(k => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
        .map(k => {
          // Flip horizontally on android or when using back camera on iOS.
          const flipX = IS_ANDROID || cameraType === Camera.Constants.Type.back;
          const x = flipX ? cameraLayoutWidth - k.x : k.x;
          const y = k.y;
          const cx =
            (x / cameraLayoutWidth) *
            (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
          const cy =
            (y / cameraLayoutHeight) *
            (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);
          return (
            <Circle
              key={`skeletonkp_${k.name}`}
              cx={cx}
              cy={cy}
              r="4"
              strokeWidth="2"
              fill="#00AA00"
              stroke="white"
            />
          );
        });
      return <Svg style={styles.svg}>{keypoints}</Svg>;
    } else {
      return <View></View>;
    }
  };

  const find_angle = (a: any, b: any, c: any) => {
    let radians =
      Math.atan2(c[0].y - b[0].y, c[0].x - b[0].x) -
      Math.atan2(a[0].y - b[0].y, a[0].x - b[0].x);
    let angle = Math.abs(radians * (180 / Math.PI));
    return angle;
  };

  const serveTypeDetectionthreshold = (poses: any) => {
    // console.log('Analysis: ', analysis_data.data[0]);
    // console.log('Analysis: ', analysis_data.data[1]);
    // console.log('Analysis: ', analysis_data.data[2]);
    if (poses && poses.length > 0) {
      const object = poses[0];
      const keypoints = object.keypoints;
      var leftShoulder = keypoints.filter(function (item: any) {
        return item.name === 'left_shoulder';
      });
      var rightShoulder = keypoints.filter(function (item: any) {
        return item.name === 'right_shoulder';
      });
      var leftElbow = keypoints.filter(function (item: any) {
        return item.name === 'left_elbow';
      });
      var rightElbow = keypoints.filter(function (item: any) {
        return item.name === 'right_elbow';
      });
      var rightHip = keypoints.filter(function (item: any) {
        return item.name === 'right_hip';
      });
      var leftHip = keypoints.filter(function (item: any) {
        return item.name === 'left_hip';
      });
      var leftKnee = keypoints.filter(function (item: any) {
        return item.name === 'left_knee';
      });
      var rightKnee = keypoints.filter(function (item: any) {
        return item.name === 'right_knee';
      });
      var l_shoulder_angle2 = find_angle(rightHip, rightShoulder, rightElbow);
      var r_hip_angle = find_angle(rightShoulder, rightHip, rightKnee);
      // console.log(
      //   'LeftShoulder and RightSholder',
      //   l_shoulder_angle2,
      //   r_hip_angle,
      // );

      if (leftShoulder[0].y > leftElbow[0].y && skipFrameCount === 0) {
        increment();
        skipFrameCount = skipFrameCount + 1;
        if (l_shoulder_angle2 < 30 && l_shoulder_angle2 > 0) {
          if (l_shoulder_angle2 < 12 && l_shoulder_angle2 > 8) {
            // console.log(serveGrade);
            setServeGrade('A');
            analysis_data.data[0][0] = analysis_data.data[0][0] + 1;
          } else if (l_shoulder_angle2 < 14 && l_shoulder_angle2 > 6) {
            setServeGrade('B');
            // console.log(serveGrade);
            analysis_data.data[0][1] = analysis_data.data[0][1] + 1;
          } else if (l_shoulder_angle2 < 16 && l_shoulder_angle2 > 4) {
            setServeGrade('C');
            // console.log(serveGrade);
            analysis_data.data[0][2] = analysis_data.data[0][2] + 1;
          } else {
            setServeGrade('D');
            // console.log(serveGrade);
            analysis_data.data[0][3] = analysis_data.data[0][3] + 1;
          }
          setServeType('Flat');
        } else if (r_hip_angle < 190 && r_hip_angle > 175) {
          //console.log('Right Hip Angle: ', rightHip);
          if (r_hip_angle < 185 && r_hip_angle > 181) {
            setServeGrade('A');
            //console.log(serveGrade);
            analysis_data.data[2][0] = analysis_data.data[2][0] + 1;
          } else if (r_hip_angle < 187 && r_hip_angle > 179) {
            setServeGrade('B');
            //console.log(serveGrade);
            analysis_data.data[2][1] = analysis_data.data[2][1] + 1;
          } else if (r_hip_angle < 188 && r_hip_angle > 177) {
            setServeGrade('C');
            //console.log(serveGrade);
            analysis_data.data[2][2] = analysis_data.data[2][2] + 1;
          } else {
            setServeGrade('D');
            //console.log(serveGrade);
            analysis_data.data[2][3] = analysis_data.data[2][3] + 1;
          }
          setServeType('Slice');
        } else {
          //console.log('Inside kick');
          //console.log(r_hip_angle);
          if (r_hip_angle > 170) {
            setServeGrade('A');
            //console.log(serveGrade);
            analysis_data.data[1][0] = analysis_data.data[1][0] + 1;
          } else if (r_hip_angle > 167) {
            setServeGrade('B');
            //console.log(serveGrade);
            analysis_data.data[1][1] = analysis_data.data[1][1] + 1;
          } else if (r_hip_angle > 164) {
            setServeGrade('C');
            //console.log(serveGrade);
            analysis_data.data[1][2] = analysis_data.data[1][2] + 1;
          } else {
            setServeGrade('D');
            //console.log(serveGrade);
            analysis_data.data[1][3] = analysis_data.data[1][3] + 1;
          }
          setServeType('Kick');
        }
        setData(analysis_data.data);
      } else if (skipFrameCount > 0 && skipFrameCount < 5) {
        skipFrameCount = skipFrameCount + 1;
        //console.log(skipFrameCount);
      } else {
        skipFrameCount = 0;
      }

      // if (leftShoulder[0].y > leftElbow[0].y && skipFrameCount === 0) {
      //   increment();
      //   skipFrameCount = skipFrameCount + 1;
      //   if (l_shoulder_angle2 < 30 && l_shoulder_angle2 > 0) {
      //     if (l_shoulder_angle2 < 12 && l_shoulder_angle2 > 8) {
      //       console.log(serveGrade);
      //       setServeGrade('A');
      //       analysis_data.data[0][0] = analysis_data.data[0][0] + 1;
      //     } else if (l_shoulder_angle2 < 14 && l_shoulder_angle2 > 6) {
      //       setServeGrade('B');
      //       console.log(serveGrade);
      //       analysis_data.data[0][1] = analysis_data.data[0][1] + 1;
      //     } else if (l_shoulder_angle2 < 16 && l_shoulder_angle2 > 4) {
      //       setServeGrade('C');
      //       console.log(serveGrade);
      //       analysis_data.data[0][2] = analysis_data.data[0][2] + 1;
      //     } else {
      //       setServeGrade('D');
      //       console.log(serveGrade);
      //       analysis_data.data[0][3] = analysis_data.data[0][3] + 1;
      //     }
      //     setServeType('Flat');
      //   } else if (r_hip_angle < 179 && r_hip_angle > 165) {
      //     if (r_hip_angle < 174 && r_hip_angle > 172) {
      //       setServeGrade('A');
      //       console.log(serveGrade);
      //       analysis_data.data[2][0] = analysis_data.data[2][0] + 1;
      //     } else if (r_hip_angle < 176 && r_hip_angle > 170) {
      //       setServeGrade('B');
      //       console.log(serveGrade);
      //       analysis_data.data[2][1] = analysis_data.data[2][1] + 1;
      //     } else if (r_hip_angle < 178 && r_hip_angle > 168) {
      //       setServeGrade('C');
      //       console.log(serveGrade);
      //       analysis_data.data[2][2] = analysis_data.data[2][2] + 1;
      //     } else {
      //       setServeGrade('D');
      //       console.log(serveGrade);
      //       analysis_data.data[2][3] = analysis_data.data[2][3] + 1;
      //     }
      //     setServeType('Slice');
      //   } else {
      //     console.log('Inside kick');
      //     console.log(r_hip_angle);
      //     if (r_hip_angle < 182) {
      //       setServeGrade('A');
      //       console.log(serveGrade);
      //       analysis_data.data[1][0] = analysis_data.data[1][0] + 1;
      //     } else if (r_hip_angle < 185) {
      //       setServeGrade('B');
      //       console.log(serveGrade);
      //       analysis_data.data[1][1] = analysis_data.data[1][1] + 1;
      //     } else if (r_hip_angle < 188) {
      //       setServeGrade('C');
      //       console.log(serveGrade);
      //       analysis_data.data[1][2] = analysis_data.data[1][2] + 1;
      //     } else {
      //       setServeGrade('D');
      //       console.log(serveGrade);
      //       analysis_data.data[1][3] = analysis_data.data[1][3] + 1;
      //     }
      //     setServeType('Kick');
      //   }
      //   setData(analysis_data.data);
      // } else if (skipFrameCount > 0 && skipFrameCount < 5) {
      //   skipFrameCount = skipFrameCount + 1;
      //   console.log(skipFrameCount);
      // } else {
      //   skipFrameCount = 0;
      // }
    }
  };

  const calibrate = (poses: any) => {
    // console.log("I am here");
    // const cx1 = 400;
    // const cy1 = 486;

    // const cx2 = 448;
    // const cy2 = 780;

    // const cx3 = 276;
    // const cy3 = 780;

    // const cx4 = 295;
    // const cy4 = 486;

    // const cx1 = cameraLayoutWidth / 2 - 150;
    // const cy1 = cameraLayoutHeight - 600;

    // const cx2 = cameraLayoutWidth / 2 + 150;
    // const cy2 = cameraLayoutHeight - 600;

    // const cx3 = cameraLayoutWidth / 2 - 150;
    // const cy3 = cameraLayoutHeight - 100;

    // const cx4 = cameraLayoutWidth / 2 + 150;
    // const cy4 = cameraLayoutHeight - 100;

    const cx1 = 100;
    const cy1 = 100;

    const cx2 = cameraLayoutWidth - 100;
    const cy2 = 100;

    const cx3 = 100;
    const cy3 = cameraLayoutHeight - 50;

    const cx4 = cameraLayoutWidth - 100;
    const cy4 = cameraLayoutHeight - 50;

    if (poses && poses.length > 0) {
      const object = poses[0];
      const keypoints = object.keypoints;

      let tempCount = 0;

      for (var i = 0; i < keypoints.length; i++) {
        // console.log(keypoints[i].score);
        // console.log("Next");

        const flipX = IS_ANDROID || cameraType === Camera.Constants.Type.back;
        const x = flipX ? cameraLayoutWidth - keypoints[i].x : keypoints[i].x;
        const y = keypoints[i].y;
        const cx =
          (x / cameraLayoutWidth) *
          (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
        const cy =
          (y / cameraLayoutHeight) *
          (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

        // console.log('CX', cx, 'CX2', cx2);
        // console.log('CX: ', cx, ' CY: ', cy);
        // console.log('X: ', cx1, ' Y: ', cx2);

        if (keypoints[i].score && keypoints[i].score * 100 < 60) {
          tempCount = tempCount + 1;
          // console.log('Score');
        }
        if (cx < cx1) {
          // console.log('First');
          tempCount = tempCount + 1;
        }
        if (cx > cx2) {
          // console.log('Second');
          tempCount = tempCount + 1;
        }
        if (cy < cy1) {
          // console.log('Third');
          tempCount = tempCount + 1;
        }
        if (cy > cy3) {
          // console.log('Fourth');
          tempCount = tempCount + 1;
        }
      }

      if (tempCount === 0) {
        setIsCalibratedr(true);
        setIsCalibratedp(false);
        isCalibrated = true;
        startRecording();
        // console.log('Calibrated Successfully');
      } else {
        // console.log('Please Calibrate Yourself');
      }

      // var leftWrist = keypoints.filter(function (item: any) {
      //   return item.name === "left_index";
      // });

      // var rightWrist = keypoints.filter(function (item: any) {
      //   return item.name === "right_index";
      // });

      // var leftAnkle = keypoints.filter(function (item: any) {
      //   return item.name === "left_foot_index";
      // });

      // var rightAnkle = keypoints.filter(function (item: any) {
      //   return item.name === "right_foot_index";
      // });

      // if (true) {
      //   // console.log("temp  Count");
      //   console.log(
      //     leftWrist[0].x,
      //     leftWrist[0].y,
      //     rightWrist[0].x,
      //     rightWrist[0].y
      //   );
      //   if (
      //     leftWrist[0].x < cx1 + 50 &&
      //     leftWrist[0].x > cx1 - 50 &&
      //     leftWrist[0].y < cy1 + 50 &&
      //     leftWrist[0].y > cy1 - 50
      //   ) {
      //     console.log("Temp Count");
      //     if (
      //       rightWrist[0].x < cx4 + 50 &&
      //       rightWrist[0].x > cx4 - 50 &&
      //       rightWrist[0].y < cy4 + 50 &&
      //       rightWrist[0].y > cy4 - 50
      //     ) {
      //       console.log("Temp Count");
      //       if (
      //         leftAnkle[0].x < cx2 + 50 &&
      //         leftAnkle[0].x > cx2 - 50 &&
      //         leftAnkle[0].y < cy2 + 50 &&
      //         leftAnkle[0].y > cy2 - 50
      //       ) {
      //         console.log("Temp Count");
      //         if (
      //           rightAnkle[0].x < cx3 + 50 &&
      //           rightAnkle[0].x > cx3 - 50 &&
      //           rightAnkle[0].y < cy3 + 50 &&
      //           rightAnkle[0].y > cy3 - 50
      //         ) {
      //           console.log("Temp Count");
      //           setIsCalibratedr(true);
      //           setIsCalibratedp(false);
      //           isCalibrated = true;
      //           // console.log("inside", isCalibrated);
      //         }
      //       }
      //     }
      //   }
      // }
    }
  };

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext,
  ) => {
    console.log('images, ', JSON.stringify(images));
    const loop = async () => {
      const imageTensor = images.next().value as tf.Tensor3D;
      // console.log('imageTensor, ', JSON.stringify(imageTensor));
      const startTs = Date.now();
      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now(),
      );
      calibrate(poses);
      if (isCalibrated && !isCompletedRecording) {
        serveTypeDetectionthreshold(poses);
        // console.log();
      } else if (isCompletedRecording) {
        isCompletedRecording = false;
      }
      const latency = Date.now() - startTs;
      setFps(Math.floor(1000 / latency));
      setPoses(poses);
      tf.dispose([imageTensor]);
      if (rafId.current === 0) {
        return;
      }
      if (!AUTO_RENDER) {
        updatePreview();
        gl.endFrameEXP();
      }
      rafId.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const getTextureRotationAngleInDegrees = () => {
    if (IS_ANDROID) {
      return 0;
    }
    switch (orientation) {
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 180;
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return cameraType === Camera.Constants.Type.front ? 270 : 90;
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return cameraType === Camera.Constants.Type.front ? 90 : 270;
      default:
        return 0;
    }
  };

  const camView = () => {
    return (
      <View
        style={{
          position: 'relative',
          width: cameraWidth,
          height: cameraHeight,
        }}>
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          resizeWidth={cameraWidth}
          resizeHeight={cameraHeight}
          resizeDepth={3}
          rotation={getTextureRotationAngleInDegrees()}
          onReady={handleCameraStream}
        />
      </View>
    );
  };
  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    console.log('Dimensions : ', x, y, height, width);
    cameraLayoutWidth = width;
    setCameraWidth(width);
    cameraLayoutHeight = height;
    setCameraHeight(height);
  };
  return (
    <SafeAreaView style={styles_external.main_view}>
      <HeaderWithText
        text={title}
        hideProfileSection={true}
        navigation={navigation}
      />
      <View style={styles.cameraView}>
        <View onLayout={onLayout} style={styles.cameraContainer}>
          {tfReady ? (
            camView()
          ) : (
            <View style={styles.loadingMsg}>
              {isLoading && (
                <Text style={styles.loadingMsgText}>
                  Preparing live camera photages...
                </Text>
              )}
            </View>
          )}
          {/* {renderPose()} */}
          {renderSkeleton()}
          {renderCalibrationPoints()}
          {renderFps()}
          {renderCalibration()}
          {renderCameraTypeSwitcher()}
        </View>
        {isStartedVideoRecording && (
          <View style={styles.buttonContainer}>
            <IconButton
              styles={styles.recordIcon}
              icon={stopIcon}
              onPress={handleStopCamera}
              transparent={true}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default App4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  calibrationContainer: {
    position: 'absolute',
    top: 10,
    left: 100,
    width: 80,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    padding: 0,
  },
  cameraView: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 128,
    marginTop: 32,
  },
  camera: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'blue',
    zIndex: 500,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'blue',
    flexDirection: 'row',
    margin: 0,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  recordIconStyle: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 36,
    zIndex: 1000,
  },
  recordIcon: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 36,
    zIndex: 1000,
  },
  loadingMsg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMsgText: {
    color: 'red',
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
    marginTop: 16,
  },
  fpsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 80,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
    marginTop: 16,
  },
  svg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 30,
  },
  containerPortrait: {
    position: 'relative',
    width: cameraLayoutWidth,
    height: cameraLayoutHeight,
  },
  containerLandscape: {
    position: 'relative',
    width: cameraLayoutWidth,
    height: cameraLayoutHeight,
  },
});
