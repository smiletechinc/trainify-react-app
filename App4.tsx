import React, { useEffect, useState, useRef, FunctionComponent } from "react";
import { StyleSheet, Text, View, Dimensions, Platform, Alert } from "react-native";

import { Camera } from "expo-camera";

import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  bundleResourceIO,
  cameraWithTensors,
} from "@tensorflow/tfjs-react-native";
import Svg, { Circle } from "react-native-svg";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { CameraType } from "expo-camera/build/Camera.types";
import { CounterContext } from "./src/context/counter-context";
import { addVideoService } from "./src/services/servePracticeServices";
import styles_external from './src/screens/main-app/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderWithText from './src/global-components/header/HeaderWithText';

import { IconButton } from './src/components/buttons'

const stopIcon = require('./src/assets/images/icon_record_stop.png');
const TensorCamera = cameraWithTensors(Camera);
const IS_ANDROID = Platform.OS === "android";
const IS_IOS = Platform.OS === "ios";
const CAM_WIDTH = Dimensions.get('window').width;
const CAM_HEIGHT = Dimensions.get('window').height;
const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 3 / 4 : 9 / 16);
const MIN_KEYPOINT_SCORE = 0.3;
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);
const AUTO_RENDER = false;

type Props = {
  navigation: any
  route:any
}

const App4: FunctionComponent<Props> = (props) => {
  const {navigation, route} = props
  const {title} = route.params
  const [isLoading, setLoading] = React.useState(false);
  const { increment, decrement, reset, 
  count, calibrated, setCalibrated, setData, data } = React.useContext(CounterContext);
  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>();
  const [typeOfServeDetector, setTypeOfServeDetector] =
    useState<tf.LayersModel>();
  const [poses, setPoses] = useState<posedetection.Pose[]>();
  const [fps, setFps] = useState(0);
  const [serveType, setServeType] = useState("");
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>();
  // const [skipFrameCount, setSkipFrameCount] = useState(0);
  let skipFrameCount = 0;
  const [totalServes, setTotalServes] = useState(0);
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.front
  );
  var isCalibrated = false;
  var isCompletedRecording = false;
  const [isCalibratedr, setIsCalibratedr] = useState(false);
  const [canAdd, setCanAdd] = useState(true);
  const [serveGrade, setServeGrade] = useState('');
  // For Serve Grading
  let AGradeServe = 0;
  let BGradeServe = 0;
  let CGradeServe = 0;
  let DGradeServe = 0;

  var analysis_data = {
    labels: ["Flat", "Kick", "Slice"],
    legend: ["A", "B", "C", "D"],
    data: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
  };
  const rafId = useRef<number | null>(null);

  const calibrate = (poses: any) => {
    if (poses && poses.length > 0) {
      const object = poses[0];
      const keypoints = object.keypoints;
      let tempCount = 0;
      for (var i = 0; i < keypoints.length; i++) {
        if (keypoints[i].score && keypoints[i].score * 100 < 60) {
          tempCount = tempCount + 1;
        }
      }
      if (tempCount == 0) {
        isCalibrated = true
        setIsCalibratedr(true);
        
      }
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
    console.log("Analysis: ", analysis_data.data[0]);
    console.log("Analysis: ", analysis_data.data[1]);
    console.log("Analysis: ", analysis_data.data[2]);
    if (poses && poses.length > 0) {
      const object = poses[0];
      const keypoints = object.keypoints;
      var leftShoulder = keypoints.filter(function (item: any) {
        return item.name === "left_shoulder";
      });
      var rightShoulder = keypoints.filter(function (item: any) {
        return item.name === "right_shoulder";
      });
      var leftElbow = keypoints.filter(function (item: any) {
        return item.name === "left_elbow";
      });
      var rightElbow = keypoints.filter(function (item: any) {
        return item.name === "right_elbow";
      });
      var rightHip = keypoints.filter(function (item: any) {
        return item.name === "right_hip";
      });
      var leftHip = keypoints.filter(function (item: any) {
        return item.name === "left_hip";
      });
      var leftKnee = keypoints.filter(function (item: any) {
        return item.name === "left_knee";
      });
      var rightKnee = keypoints.filter(function (item: any) {
        return item.name === "right_knee";
      });

      var l_shoulder_angle2 = find_angle(rightHip, rightShoulder, rightElbow);
      var r_hip_angle = find_angle(leftShoulder, leftHip, leftKnee);
      console.log("LeftShoulder and RightSholder", l_shoulder_angle2, r_hip_angle);
      if (leftShoulder[0].y > leftElbow[0].y && skipFrameCount === 0) {
        increment();
        skipFrameCount = skipFrameCount + 1;
        if (l_shoulder_angle2 < 20 && l_shoulder_angle2 > 0) {
          if (l_shoulder_angle2 < 12 && l_shoulder_angle2 > 8) {
            console.log(serveGrade);
            setServeGrade("A");
            analysis_data.data[0][0] = analysis_data.data[0][0] + 1;
          } else if (l_shoulder_angle2 < 14 && l_shoulder_angle2 > 6) {
            setServeGrade("B");
            console.log(serveGrade);
            analysis_data.data[0][1] = analysis_data.data[0][1] + 1;
          } else if (l_shoulder_angle2 < 16 && l_shoulder_angle2 > 4) {
            setServeGrade("C");
            console.log(serveGrade);
            analysis_data.data[0][2] = analysis_data.data[0][2] + 1;
          } else {
            setServeGrade("D");
            console.log(serveGrade);
            analysis_data.data[0][3] = analysis_data.data[0][3] + 1;
          }
          setServeType("Flat");
        } else if (r_hip_angle < 179 && r_hip_angle > 165) {
          if (r_hip_angle < 174 && r_hip_angle > 172) {
            setServeGrade("A");
            console.log(serveGrade);
            analysis_data.data[2][0] = analysis_data.data[2][0] + 1;
          } else if (r_hip_angle < 176 && r_hip_angle > 170) {
            setServeGrade("B");
            console.log(serveGrade);
            analysis_data.data[2][1] = analysis_data.data[2][1] + 1;
          } else if (r_hip_angle < 178 && r_hip_angle > 168) {
            setServeGrade("C");
            console.log(serveGrade);
            analysis_data.data[2][2] = analysis_data.data[2][2] + 1;
          } else {
            setServeGrade("D");
            console.log(serveGrade);
            analysis_data.data[2][3] = analysis_data.data[2][3] + 1;
          }
          setServeType("Slice");
        } else {
          console.log("Inside kick");
          console.log(r_hip_angle);
          if (r_hip_angle < 182) {
            setServeGrade("A");
            console.log(serveGrade);
            analysis_data.data[1][0] = analysis_data.data[1][0] + 1;
          } else if (r_hip_angle < 185) {
            setServeGrade("B");
            console.log(serveGrade);
            analysis_data.data[1][1] = analysis_data.data[1][1] + 1;
          } else if (r_hip_angle < 188) {
            setServeGrade("C");
            console.log(serveGrade);
            analysis_data.data[1][2] = analysis_data.data[1][2] + 1;
          } else {
            setServeGrade("D");
            console.log(serveGrade);
            analysis_data.data[1][3] = analysis_data.data[1][3] + 1;
          }
          setServeType("Kick");
        }

        setData(analysis_data.data);

      } else if (skipFrameCount > 0 && skipFrameCount < 10) {
        skipFrameCount = skipFrameCount + 1;
        console.log(skipFrameCount);
      } else {
        skipFrameCount = 0;
      }
    }
  };
  const serveTypeDetection = (poses: any) => {
    if (poses && poses.length > 0) {
      const object = poses[0];
      const keypoints = object.keypoints;

      var rightShoulder = keypoints.filter(function (item: any) {
        return item.name === "right_shoulder";
      });

      var rightElbow = keypoints.filter(function (item: any) {
        return item.name === "right_elbow";
      });

      if (rightShoulder[0].y > rightElbow[0].y && skipFrameCount === 0) {
        console.log("Elbow is above Shoulder");

        skipFrameCount = skipFrameCount + 1;

        let test_pose = new Array();

        for (let i = 0; i < keypoints.length; i++) {
          var temp = keypoints[i];
          // console.log("I am here");
          test_pose.push(temp.x);
          test_pose.push(temp.y);
          test_pose.push(temp.score);
          // console.log(temp.x, temp.y, temp.score);
        }

        let x = tf.tensor([test_pose]).reshape([-1, 99]);

        const res = typeOfServeDetector.predict(x) as tf.Tensor;

        const values = res.dataSync();
        const arr = Array.from(values);
        console.log(values);
        console.log(arr);

        const max = Math.max(...arr);
        const index: number = arr.indexOf(max);
        console.log("total numbers of elemnt",index);
        const serveToCheck = arr[index];
        if (serveToCheck * 100 > 90) {
          AGradeServe = AGradeServe + 1;
        } else if (serveToCheck * 100 > 80) {
          BGradeServe = BGradeServe + 1;
        } else if (serveToCheck * 100 > 70) {
          CGradeServe = CGradeServe + 1;
        } else {
          DGradeServe = DGradeServe + 1;
        }
        console.log("A Grade Serve: ", AGradeServe);
        console.log("B Grade Serve: ", BGradeServe);
        console.log("C Grade Serve: ", CGradeServe);
        console.log("D Grade Serve: ", DGradeServe);
        if (index && index === 0) {
          console.log("Inside Flat");
          setServeType("Flat");
          console.log("ServeType: ", serveType);
        } else if (index && index === 1) {
          console.log("Inside Kick");
          setServeType("Kick");
          console.log("ServeType: ", serveType);
        } else {
          console.log("Inside Slice");
          setServeType("Slice");
          console.log("ServeType: ", serveType);
        }
        console.log("ServeType: ", serveType);
      } else if (skipFrameCount > 0 && skipFrameCount < 10) {
        skipFrameCount = skipFrameCount + 1;
      } else {
        skipFrameCount = 0;
      }
    }
  };

  const shotDetection = (poses: any) => {
    const keypoints3D = poses["keypoints3D"];
    if (poses && poses.length > 0) {
      const object = poses[0];
      const keypoints = object.keypoints;

      var rightShoulder = keypoints.filter(function (item: any) {
        return item.name === "left_shoulder";
      });
      var rightElbow = keypoints.filter(function (item: any) {
        return item.name === "left_elbow";
      });

      console.log(skipFrameCount);

      if (rightShoulder[0].y > rightElbow[0].y && skipFrameCount === 0) {
        console.log("I am here");

        skipFrameCount = skipFrameCount + 1;

        let totalServesTemp = totalServes + 1;
        setTotalServes(totalServesTemp);
          setCanAdd(false);
          clearTimer(getDeadTime());

      } else if (skipFrameCount > 0 && skipFrameCount < 80) {
        skipFrameCount = skipFrameCount + 1;
      } else {
        skipFrameCount = 0;
      }
    }
  };

  useEffect(() => {
  async function prepare() {
    rafId.current = null;

    const curOrientation = await ScreenOrientation.getOrientationAsync();
    setOrientation(curOrientation);

    ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });

    await Camera.requestCameraPermissionsAsync();

    await tf.ready();

    const model = posedetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: "tfjs", // or 'tfjs'
      modelType: "full",
    };

    const detector = await posedetection.createDetector(
      model,
      detectorConfig
    );

    setModel(detector);

    console.log("Loading Type of Serve Model");

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

    const model_json = await require("./src/assets/model/model.json");
    const model_weight = await require("./src/assets/model/group1-shard.bin");
    const model_tos = await tf.loadLayersModel(
      bundleResourceIO(model_json, model_weight)
    );

    setTypeOfServeDetector(model_tos);

    setTfReady(true);
  }
  prepare();
  }, []);

    useEffect(() => {
      return () => {
        reset();
        setCalibrated(false);
        if (rafId.current != null && rafId.current !== 0) {
          reset();
          cancelAnimationFrame(rafId.current);
          rafId.current = 0;
        }
      };
    }, []);

    const handleCameraStream = async (
      images: IterableIterator<tf.Tensor3D>,
      updatePreview: () => void,
      gl: ExpoWebGLRenderingContext
    ) => {
      const loop = async () => {
        const imageTensor = images.next().value as tf.Tensor3D;
  
        const startTs = Date.now();
        const poses = await model!.estimatePoses(
          imageTensor,
          undefined,
          Date.now()
        );

        calibrate(poses);
        if(isCalibrated && !isCompletedRecording){
          serveTypeDetectionthreshold(poses)
        } else if (isCompletedRecording) {
          addVideoToFirebase()
          isCompletedRecording = false
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

    const renderPose = () => {
      if (poses != null && poses.length > 0) {
        const keypoints = poses[0].keypoints
          .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
          .map((k) => {
            // Flip horizontally on android or when using back camera on iOS.
            const flipX = IS_ANDROID || cameraType === Camera.Constants.Type.back;
            const x = flipX ? getOutputTensorWidth() - k.x : k.x;
            const y = k.y;
            const cx =
              (x / getOutputTensorWidth()) *
              (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT);
            const cy =
              (y / getOutputTensorHeight()) *
              (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH);
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
  
    const renderFps = () => {
      return (
        <View style={styles.fpsContainer}>
          <Text>Total {count}</Text>
          <Text>Last Serve Type {serveType}</Text>
          <Text>Grade {serveGrade}</Text>
        </View>
      );
    };
  
    const renderCameraTypeSwitcher = () => {
      return (
        <View
          style={styles.cameraTypeSwitcher}
          onTouchEnd={handleSwitchCameraType}
        >
          <Text>
            Switch to{" "}
            {cameraType === Camera.Constants.Type.back ? "front" : "back"} camera
          </Text>
        </View>
      );
    };
  
    const handleStopCamera = () => {
     isCompletedRecording = true;
     addVideoToFirebase();
    };

    const addVideoSuccess = (video?:any) => {
      console.log("Added: ", JSON.stringify(video));
      if (video){
        navigation.navigate('VideoPlayerContainer', {video:video});
      }
      if (video) {
        Alert.alert("Trainify", `Video added successfully.`);
      }
    }
    const addVideoFailure = (error?:any) => {
      console.log("Error: ", JSON.stringify(error));
      if (error) {
        Alert.alert("Trainify", `Error in adding video.`);
      }
    }
  
    const addVideoToFirebase = () => {
  
      let videoData = {
        duration: 9.01,
         fileName: "66748333739__C225D81F-7822-4680-BD8E-C66E6A08A53F.mov",
        fileSize: 9363694,
        height: 720,
        id: "EABE012E-DDBB-4DC9-8F78-E159F198ECFE/L0/001",
         timestamp: "2022-02-25T17:02:18.000+0500",
         type: "video/quicktime",
         uri: "file:///var/mobile/Containers/Data/Application/4EC5C8B3-E530-4B35-83A8-49C844AA23DA/tmp/66748333739__C225D81F-7822-4680-BD8E-C66E6A08A53F.mov",
         width: 1280
        }
  
        const tempAnalysisData = {
          labels: ["Flat", "Kick", "Slice"],
          legend: ["A", "B", "C", "D"],
          data:data,
          barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
        };
  
      const tempVideoData = {...videoData, analysisData: tempAnalysisData}
  
      console.log('analysis_data for firebase, ', JSON.stringify(data));
      console.log('sending to firebase, ', JSON.stringify(tempVideoData));
  
        addVideoService(tempVideoData, addVideoSuccess, addVideoFailure);
    }

    const handleSwitchCameraType = () => {

      if (cameraType === Camera.Constants.Type.back) {
        setCameraType(Camera.Constants.Type.front);
      } else {
        setCameraType(Camera.Constants.Type.back);
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
  
  const Ref = useRef(null);
  
  const [timer, setTimer] = useState('10000');
  const [timerSeconds, setSeconds] = useState(0);
  
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 * 60 * 60) % 24);
    return {
        total, hours, minutes, seconds
    };
  }
  
  
  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
        setSeconds(seconds);
    }
  }
  
  const clearTimer = (e) => {
   
    setSeconds(10);

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
        startTimer(e);
    }, 1000)
    Ref.current = id;
  }
  
  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
    return deadline;
  }
  
  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  useEffect(() => {
    setCalibrated(calibrated);
  }, [calibrated])
  
  useEffect(()=> {
    if (timerSeconds >= 2){
      setCanAdd(false);
    } else if (timerSeconds < 2) {
      setCanAdd(true)
    }
  },[timerSeconds])
  
  useEffect(() => {
    if (tfReady) {
      clearTimer(getDeadTime());
    }
  }, [tfReady]);
  
  const camView = () => {
    return (
      <View
      style={
        isPortrait() ? styles.containerPortrait : styles.containerLandscape
      }>
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          resizeWidth={getOutputTensorWidth()}
          resizeHeight={getOutputTensorHeight()}
          resizeDepth={3}
          rotation={getTextureRotationAngleInDegrees()}
          onReady={handleCameraStream}
        />
        
      </View>
    );
  };
        return (
      <SafeAreaView style={styles_external.main_view}>
        <HeaderWithText 
          text = {title}
          hideProfileSection = {true}
          navigation={navigation}
        />
        <View style={styles.cameraView} >
          <View style={styles.cameraContainer}>
            {tfReady ? camView()
              :
              <View style={styles.loadingMsg}>
                {isLoading && <Text style={styles.loadingMsgText} >Preparing live camera photages...</Text>}
              </View>
              }
              {renderPose()}
              {renderFps()}
              {renderCalibration()}
              {renderCameraTypeSwitcher()}
          </View>
          <View style={styles.buttonContainer}>
            <IconButton styles={styles.recordIcon} icon={stopIcon} onPress={handleStopCamera} transparent={true} />
          </View>
       </View>
      </SafeAreaView>

    );
  }

  export default App4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent:'center',
    justifyContent:'center',
    backgroundColor:'yellow',
  },
  canvas: {
    width: CAM_WIDTH,
    height: CAM_HEIGHT,
    zIndex: 200,
    borderWidth: 2,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    paddingTop: 20,
    overflow: 'visible',
  },
  calibrationContainer: {
    position: "absolute",
    top: 10,
    left: 100,
    width: 80,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
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
    height: '88%',
    backgroundColor: 'black',
    marginTop:16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth:1,
    borderColor:'black',
    borderStyle:'solid'
  },
  cameraView: {
    display:'flex',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  camera: {
    display:'flex',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    overflow: 'hidden',
    backgroundColor:'blue',
    zIndex: 500,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'blue',
    flexDirection: 'row',
    margin: 20,
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
    position:'absolute',
    bottom:36,
    zIndex:1000,
  },
  recordIcon: {
    width: 60,
    height: 60,
    position:'absolute',
    bottom:108,
    zIndex:1000,
  },
  loadingMsg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMsgText: {
    color:'red',
  },
  cameraTypeSwitcher: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 180,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
    marginTop: 16,
  },
  fpsContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 80,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
    marginTop: 16,
  },
  svg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 30,
  },
  containerPortrait: {
    position: "relative",
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    marginTop: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  containerLandscape: {
    position: "relative",
    width: CAM_PREVIEW_HEIGHT,
    height: CAM_PREVIEW_WIDTH,
    marginLeft: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
});