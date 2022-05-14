import React, {useEffect, useState, useRef, FunctionComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Alert,
  Button,
  Linking,
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
import styles_external from './src/screens/main-app/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderWithText from './src/global-components/header/HeaderWithText';
import {IconButton} from './src/components/buttons';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';
import {Countdown} from 'react-native-element-timer';
import {AuthContext} from './src/context/auth-context';
import {PermissionContext} from './src/context/permissions-context';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import CountDown from 'react-native-countdown-component';

const stopIcon = require('./src/assets/images/stop.png');
const uploadAnimation = require('./src/assets/animations/uploading-animation.json');
const fronCamera = require('./src/assets/images/frontCamera.png');
const backCamera = require('./src/assets/images/backCamera.png');

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
  useKeepAwake();
  const {
    setCameraPermissions,
    setGalleryPermissions,
    setRecordigPermissions,
    isCameraPermissions,
    isGalleryPermissions,
    isRecordingPermissions,
    resetPermissions,
  } = React.useContext(PermissionContext);

  const {
    authUser,
    authObject,
    setAuthUser: setUser,
    logoutUser,
  } = React.useContext(AuthContext);

  const [cameraWidth, setCameraWidth] = useState(120);
  const [cameraHeight, setCameraHeight] = useState(160);
  const [cameraX, setCameraX] = useState(120);
  const [cameraY, setCameraY] = useState(160);
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
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCalibratedp, setIsCalibratedp] = useState(true);
  const [canAdd, setCanAdd] = useState(true);
  const [serveGrade, setServeGrade] = useState('');
  const rafId = useRef<number | null>(null);
  const countdownRef = useRef(null);
  const [remainingTime, setRemainingTime] = useState<Number>(0);
  const [alertModalVisible, setAlertVisibleModal] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [descText, setDescText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [timerLimet, setTimerLimit] = useState(false);
  const [userPaymentPlan, setUserPaymentPlan] = useState('User');

  let skipFrameCount = 0;
  // let timerLimit = 0;
  let deviceFps = 0;
  var isCalibrated = false;
  var isCompletedRecording = false;
  var stoppedVideoRecording = false;

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
      ScreenOrientation.addOrientationChangeListener(event => {
        setOrientation(event.orientationInfo.orientation);
      });

      await Camera.requestCameraPermissionsAsync();

      await tf.ready();

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
      setTfReady(false);
      setIsStartedVideoRecording(false);
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

  useEffect(() => {
    if (authUser) {
      console.log('authObject', authObject);
      if (authObject.paymentPlan === 'Basic') {
        setTimerLimit(true);
        console.log(timerLimet);
      } else if (authObject.paymentPlan === 'Premium') {
        // setTimerLimit(60 * 1);
        setTimerLimit(false);
      }
    }
  }, [authObject, authUser]);

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

  const [isRecordingInProgress, setIsRecordingInProgress] = useState(false);
  const [videoURI, setVideoURI] = useState(null);

  const goSettings = () => {
    Linking.openSettings();
  };
  const proceedtoback = () => {
    navigation.goBack();
  };

  const failedToSaveAlert = () => {
    Alert.alert(
      'Failed to save video.',
      'Please check your phone memory.',
      [
        {text: 'Go Back', onPress: () => proceedtoback()},
        {text: 'Go To Settings', onPress: () => goSettings()},
      ],
      {cancelable: false},
    );
  };

  const stopRecording = async () => {
    try {
      const responseReocrding = await RecordScreen.stopRecording()
        .then(async res => {
          setTfReady(false);
          if (res) {
            setTfReady(false);
            setIsTimerRunning(false);
            setIsStartedVideoRecording(false);
            stoppedVideoRecording = true;
            console.log('recording stopped:', JSON.stringify(res));
            const url = res.result.outputURL;
            try {
              const response = await CameraRoll.save(url)
                .then(promise => {
                  console.log('promise: ', promise);
                  setGalleryPermissions(true);
                  if (promise) {
                    setIsRecordingInProgress(false);
                    console.log('Recording saved successfuly.');
                    setVideoURI(url);
                    navigation.navigate('UploadServeContainerHook', {
                      capturedVideoURI: url,
                      graphData: data,
                      createrId: authObject.id,
                    });
                  } else {
                    Alert.alert('Video could not saved');
                  }
                })
                .catch(e => {
                  console.log('Permission Denied');
                  failedToSaveAlert();
                });
            } catch (error) {
              Alert.alert('Failed to save video in gallery', error);
            }
          }
        })
        .catch(error => Alert.alert('Error in recording...: ', error));
    } catch (error) {
      Alert.alert('Error in recording #catch: ', error);
    }
  };

  const handleStopCamera = () => {
    console.log('Hello');
    stoppedVideoRecording = true;
    // countdownRef.current.stop();
    setIsRecordingInProgress(false);
    setIsStartedVideoRecording(false);
    setIsTimerRunning(false);
    // alert('TimerStopped');
    stopRecording();
  };

  const handleStopTiemer = () => {
    if (isTimerRunning && !stoppedVideoRecording) {
      // alert('Finished');
      console.log('Hello');
      setIsRecordingInProgress(false);
      setIsStartedVideoRecording(false);
      setIsTimerRunning(false);
      stopRecording();
    }
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
      <View style={styles.cameraIcon} onTouchEnd={handleSwitchCameraType}>
        {cameraType === Camera.Constants.Type.back ? (
          <IconButton
            icon={fronCamera}
            onPress={handleSwitchCameraType}
            transparent={true}
          />
        ) : (
          <IconButton
            icon={backCamera}
            onPress={handleSwitchCameraType}
            transparent={true}
          />
        )}
      </View>
    );
  };

  const startRecording = async () => {
    await RecordScreen.startRecording({mic: false})
      .then(res => {
        // setIsStartedVideoRecording(true);
        // setIsTimerRunning(true);
        // console.log('Video recording started.');
        // countdownRef.current.start();
      })
      .catch(error => {
        console.error(error);
        Alert.alert(
          'Sorry! Recording cannot be start at the moment',
          'Plese check your permissions in the settings',
        );
        console.log('Video recording could not started.');
        navigation.goBack();
      });
  };

  const renderCalibrationPoints = () => {
    const cx1 = 100;
    const cy1 = 100;

    const cx2 = cameraLayoutWidth - 100;
    const cy2 = 100;

    const cx3 = 100;
    const cy3 = cameraLayoutHeight - 50;

    const cx4 = cameraLayoutWidth - 100;
    const cy4 = cameraLayoutHeight - 50;

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

          <View
            style={{
              position: 'absolute',
              left: cx1,
              top: cy1 + 10,
              right: cx3,
              height: cx2,
              borderRadius: 2,
              borderStyle: 'solid',
              justifyContent: 'center',
              padding: 8,
              zIndex: 30,
            }}>
            {isLoading ? (
              <Text style={styles.loadingMsgText}>
                Preparing live camera photages...
              </Text>
            ) : (
              <Text style={styles.loadingMsgText}>
                Please callibrate your self so that your whole body is visible.
              </Text>
            )}
          </View>
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
        {/* <Text>Total {count}</Text> */}
        {/* <Text>Serve: {serveType}</Text> */}
        <Text>{serveType ? `${serveType}` : 'Last Serve'}</Text>
        {/* <Text>Grade {serveGrade}</Text> */}
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

      const color = 'green';
      const stroke = '2';

      return (
        <Svg
          style={styles.svg}
          height={cameraLayoutHeight}
          width={cameraLayoutWidth}>
          <Circle
            cx={lscx}
            cy={lscy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={rscx}
            cy={rscy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={lhcx}
            cy={lhcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={rhcx}
            cy={rhcy}
            r="4"
            strokeWidth="2"
            fill="#00AA00"
            stroke="white"
          />
          <Circle
            cx={lecx}
            cy={lecy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={recx}
            cy={recy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={lkcx}
            cy={lkcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={rkcx}
            cy={rkcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={ltcx}
            cy={ltcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={rtcx}
            cy={rtcy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={lacx}
            cy={lacy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />
          <Circle
            cx={racx}
            cy={racy}
            r="4"
            strokeWidth="0"
            fill="white"
            stroke="white"
          />

          <Circle
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

  const serveTypeDetectionthresholdRightHanded = (poses: any) => {
    if (poses && poses.length > 0) {
      console.log('Poses', poses[0]);

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

      if (leftShoulder[0].y > leftElbow[0].y && skipFrameCount === 0) {
        increment();
        skipFrameCount = skipFrameCount + 1;
        if (l_shoulder_angle2 < 30 && l_shoulder_angle2 > 0) {
          if (l_shoulder_angle2 < 12 && l_shoulder_angle2 > 8) {
            setServeGrade('A');
            analysis_data.data[0][0] = analysis_data.data[0][0] + 1;
          } else if (l_shoulder_angle2 < 14 && l_shoulder_angle2 > 6) {
            setServeGrade('B');
            analysis_data.data[0][1] = analysis_data.data[0][1] + 1;
          } else if (l_shoulder_angle2 < 16 && l_shoulder_angle2 > 4) {
            setServeGrade('C');
            analysis_data.data[0][2] = analysis_data.data[0][2] + 1;
          } else {
            setServeGrade('D');
            analysis_data.data[0][3] = analysis_data.data[0][3] + 1;
          }
          setServeType('Flat');
        } else if (r_hip_angle < 190 && r_hip_angle > 175) {
          if (r_hip_angle < 185 && r_hip_angle > 181) {
            setServeGrade('A');
            analysis_data.data[2][0] = analysis_data.data[2][0] + 1;
          } else if (r_hip_angle < 187 && r_hip_angle > 179) {
            setServeGrade('B');
            analysis_data.data[2][1] = analysis_data.data[2][1] + 1;
          } else if (r_hip_angle < 188 && r_hip_angle > 177) {
            setServeGrade('C');
            analysis_data.data[2][2] = analysis_data.data[2][2] + 1;
          } else {
            setServeGrade('D');
            analysis_data.data[2][3] = analysis_data.data[2][3] + 1;
          }
          setServeType('Slice');
        } else {
          if (r_hip_angle > 170) {
            setServeGrade('A');
            analysis_data.data[1][0] = analysis_data.data[1][0] + 1;
          } else if (r_hip_angle > 167) {
            setServeGrade('B');
            analysis_data.data[1][1] = analysis_data.data[1][1] + 1;
          } else if (r_hip_angle > 164) {
            setServeGrade('C');
            analysis_data.data[1][2] = analysis_data.data[1][2] + 1;
          } else {
            setServeGrade('D');
            analysis_data.data[1][3] = analysis_data.data[1][3] + 1;
          }
          setServeType('Kick');
        }
        setData(analysis_data.data);
      } else if (skipFrameCount > 0 && skipFrameCount < deviceFps * 3) {
        skipFrameCount = skipFrameCount + 1;
      } else {
        skipFrameCount = 0;
        setServeType('');
      }
    }
  };
  const serveTypeDetectionthresholdLeftHanded = (poses: any) => {
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
      var l_shoulder_angle2 = find_angle(leftHip, leftShoulder, leftElbow);
      var r_hip_angle = find_angle(leftShoulder, leftHip, leftKnee);

      if (rightShoulder[0].y > rightElbow[0].y && skipFrameCount === 0) {
        increment();
        skipFrameCount = skipFrameCount + 1;
        if (l_shoulder_angle2 < 30 && l_shoulder_angle2 > 0) {
          if (l_shoulder_angle2 < 12 && l_shoulder_angle2 > 8) {
            setServeGrade('A');
            analysis_data.data[0][0] = analysis_data.data[0][0] + 1;
          } else if (l_shoulder_angle2 < 14 && l_shoulder_angle2 > 6) {
            setServeGrade('B');
            analysis_data.data[0][1] = analysis_data.data[0][1] + 1;
          } else if (l_shoulder_angle2 < 16 && l_shoulder_angle2 > 4) {
            setServeGrade('C');
            analysis_data.data[0][2] = analysis_data.data[0][2] + 1;
          } else {
            setServeGrade('D');
            analysis_data.data[0][3] = analysis_data.data[0][3] + 1;
          }
          setServeType('Flat');
        } else if (r_hip_angle < 190 && r_hip_angle > 175) {
          if (r_hip_angle < 185 && r_hip_angle > 181) {
            setServeGrade('A');
            analysis_data.data[2][0] = analysis_data.data[2][0] + 1;
          } else if (r_hip_angle < 187 && r_hip_angle > 179) {
            setServeGrade('B');
            analysis_data.data[2][1] = analysis_data.data[2][1] + 1;
          } else if (r_hip_angle < 188 && r_hip_angle > 177) {
            setServeGrade('C');
            analysis_data.data[2][2] = analysis_data.data[2][2] + 1;
          } else {
            setServeGrade('D');
            analysis_data.data[2][3] = analysis_data.data[2][3] + 1;
          }
          setServeType('Slice');
        } else {
          if (r_hip_angle > 170) {
            setServeGrade('A');
            analysis_data.data[1][0] = analysis_data.data[1][0] + 1;
          } else if (r_hip_angle > 167) {
            setServeGrade('B');
            analysis_data.data[1][1] = analysis_data.data[1][1] + 1;
          } else if (r_hip_angle > 164) {
            setServeGrade('C');
            analysis_data.data[1][2] = analysis_data.data[1][2] + 1;
          } else {
            setServeGrade('D');
            analysis_data.data[1][3] = analysis_data.data[1][3] + 1;
          }
          setServeType('Kick');
        }
        setData(analysis_data.data);
      } else if (skipFrameCount > 0 && skipFrameCount < deviceFps * 3) {
        skipFrameCount = skipFrameCount + 1;
      } else {
        skipFrameCount = 0;
        setServeType('');
      }
    }
  };

  const calibrate = (poses: any) => {
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
        const flipX = IS_ANDROID || cameraType === Camera.Constants.Type.back;
        const x = flipX ? cameraLayoutWidth - keypoints[i].x : keypoints[i].x;
        const y = keypoints[i].y;
        const cx =
          (x / cameraLayoutWidth) *
          (isPortrait() ? cameraLayoutWidth : cameraLayoutHeight);
        const cy =
          (y / cameraLayoutHeight) *
          (isPortrait() ? cameraLayoutHeight : cameraLayoutWidth);

        if (keypoints[i].score && keypoints[i].score * 100 < 60) {
          tempCount = tempCount + 1;
        }
        if (cx < cx1) {
          tempCount = tempCount + 1;
        }
        if (cx > cx2) {
          tempCount = tempCount + 1;
        }
        if (cy < cy1) {
          tempCount = tempCount + 1;
        }
        if (cy > cy3) {
          tempCount = tempCount + 1;
        }
      }

      if (tempCount === 0) {
        setIsCalibratedr(true);
        setIsCalibratedp(false);
        isCalibrated = true;
        setIsTimerRunning(true);
        setIsStartedVideoRecording(true);
        startRecording();
      }
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
      const startTs = Date.now();
      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now(),
      );
      calibrate(poses);
      if (isCalibrated && !isCompletedRecording) {
        if (
          authObject &&
          authObject.handStyle &&
          authObject.handStyle === 'RightHanded'
        ) {
          serveTypeDetectionthresholdRightHanded(poses);
        } else {
          serveTypeDetectionthresholdLeftHanded(poses);
        }
      } else if (isCompletedRecording) {
        isCompletedRecording = false;
      }
      const latency = Date.now() - startTs;
      setFps(Math.floor(1000 / latency));
      deviceFps = Math.floor(1000 / latency);
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

  const onCameraLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    console.log('Main Camera Dimensions : ', x, y, height, width);
    setCameraX(x);
    setCameraY(y);
    // cameraLayoutWidth = width;
    // setCameraWidth(width);
    // cameraLayoutHeight = height;
    // setCameraHeight(height);
    // determineAndSetOrientation();
  };

  return (
    <SafeAreaView style={styles_external.main_view}>
      <View style={{marginTop: 4}}>
        <HeaderWithText
          text={title}
          hideProfileSection={true}
          navigation={navigation}
        />
      </View>
      <View style={styles.cameraView} onLayout={onCameraLayout}>
        <View
          style={{
            // zIndex: 20,
            width: '100%',
            borderStyle: 'solid',
            backgroundColor: 'black',
            // borderColor: 'yellow',
            // borderBottomWidth: 0,
            // borderTopWidth: 2,
            // borderLeftWidth: 2,
            // borderRightWidth: 2,
            // borderRadius: 12,
            height: 50,
          }}>
          <View>{renderFps()}</View>

          <View>{renderCameraTypeSwitcher()}</View>
        </View>
        <View onLayout={onLayout} style={styles.cameraContainer}>
          {tfReady && camView()}
          {/* {renderPose()} */}
          {renderSkeleton()}
          {renderCalibrationPoints()}
        </View>
      </View>
      {isStartedVideoRecording && (
        <IconButton
          styles={styles.stopIcon}
          icon={stopIcon}
          onPress={() => {
            handleStopCamera();
          }}
          transparent={true}
        />
      )}
      {isStartedVideoRecording && (
        <CountDown
          until={(authObject.paymentPlan === 'Basic' ? 28 : 57) * 1}
          size={16}
          running={isTimerRunning}
          style={styles.timerConatiner}
          onFinish={() => handleStopTiemer()}
          digitStyle={{backgroundColor: '#FFF'}}
          digitTxtStyle={{color: '#000000'}}
          timeToShow={['M', 'S']}
          timeLabels={{m: null, s: null}}
        />
      )}
      {/* <IconButton
        styles={styles.stopIcon}
        icon={stopIcon}
        onPress={() => {
          handleStopCamera();
        }}
        transparent={true}
      />
      <CountDown
        until={(authObject.paymentPlan === 'Basic' ? 28 : 57) * 1}
        size={16}
        running={isTimerRunning}
        style={styles.timerConatiner}
        onFinish={() => handleStopTiemer()}
        digitStyle={{backgroundColor: '#FFF'}}
        digitTxtStyle={{color: '#000000'}}
        timeToShow={['M', 'S']}
        timeLabels={{m: null, s: null}}
      /> */}
    </SafeAreaView>
  );
};

export default App4;

const styles = StyleSheet.create({
  cameraView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    marginBottom: '22.5%',
    marginTop: 32,
  },
  cameraContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '92%',
    backgroundColor: 'black',
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
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
  loadingMsgText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 28,
  },
  cameraIcon: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 0,
    right: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .4)',
    borderRadius: 2,
    padding: 8,
  },
  fpsContainer: {
    position: 'absolute',
    left: 10,
    width: 80,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .4)',
    borderRadius: 2,
    padding: 8,
  },
  timerConatiner: {
    position: 'absolute',
    top: '18%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .4)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
    alignSelf: 'center',
  },
  stopIcon: {
    width: 60,
    height: 50,
    position: 'absolute',
    left: '45%',
    top: '88%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
    zIndex: 20,
  },
  svg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 30,
  },
});
