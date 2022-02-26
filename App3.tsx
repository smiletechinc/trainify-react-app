import React, { useEffect, useState, useRef, FunctionComponent } from "react";
import { StyleSheet, Text, View, Dimensions, Platform, Alert } from "react-native";
import { useSelector} from 'react-redux';
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
import { RootState } from "./store";

import { addVideoService } from "./src/services/servePracticeServices";
import { VideoData } from "./types";
// import DataFrame from "dataframe-js";

// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera);

const IS_ANDROID = Platform.OS === "android";
const IS_IOS = Platform.OS === "ios";

// Camera preview size.
//
// From experiments, to render camera feed without distortion, 16:9 ratio
// should be used fo iOS devices and 4:3 ratio should be used for android
// devices.
//
// This might not cover all cases.
const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 3 / 4 : 9 / 16);

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3;

// The size of the resized output from TensorCamera.
//
// For movenet, the size here doesn't matter too much because the model will
// preprocess the input (crop, resize, etc). For best result, use the size that
// doesn't distort the image.
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

// Whether to auto-render TensorCamera preview.
const AUTO_RENDER = false;

// export default function UsamaCameraContainer({}) {
  const UsamaCameraContainer: FunctionComponent = ({ navigation }) => {
  const { increment, decrement, reset, count, calibrated, setCalibrated, setData, data } = React.useContext(CounterContext);
  const PoseNetModal = useSelector((state: RootState) => state.RegisterReducer.postNetModal);

  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>(PoseNetModal);
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

  // Use `useRef` so that changing it won't trigger a re-render.
  //
  // - null: unset (initial value).
  // - 0: animation frame/loop has been canceled.
  // - >0: animation frame has been scheduled.
  const rafId = useRef<number | null>(null);

  const calibrate = (poses: any) => {
    if (poses && poses.length > 0) {
      const object = poses[0];
      const keypoints = object.keypoints;
      let tempCount = 0;
      for (var i = 0; i < keypoints.length; i++) {
        // console.log(keypoints[i].score);
        // console.log("Next");
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
    // let angle = Math.atan2( y2 - y1, x2 - x1 ) * ( 180 / Math.PI )
    // console.log("I am here");
    // console.log(a, b, c);
    // console.log(c[0].y);
    let radians =
      Math.atan2(c[0].y - b[0].y, c[0].x - b[0].x) -
      Math.atan2(a[0].y - b[0].y, a[0].x - b[0].x);
    // console.log(radians);
    // angle = np.abs(radians*180.0/np.pi)
    let angle = Math.abs(radians * (180 / Math.PI));
    return angle;
  };

  const serveTypeDetectionthreshold = (poses: any) => {
    // analysis_data.data[0][0] = analysis_data.data[0][0] + 1;
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
      // Right Elbow
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
      // console.log(leftShoulder, leftElbow, leftHip);
      // console.log('rightElbow: ', leftElbow[0].x , leftElbow[0].y);
      var l_shoulder_angle2 = find_angle(rightHip, rightShoulder, rightElbow);
      var r_hip_angle = find_angle(leftShoulder, leftHip, leftKnee);
      console.log(l_shoulder_angle2, r_hip_angle);
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
      // console.log(serveGrade);
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

        console.log(index);

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

        // let totalServesTemp = totalServes + 1;
        // setTotalServes(totalServesTemp);
        // console.log(totalServesTemp);
      } else if (skipFrameCount > 0 && skipFrameCount < 10) {
        skipFrameCount = skipFrameCount + 1;
        // console.logc(skipFrameCount);
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
      // console.log('keypoints: ', keypoints);

      // Right Shoulder
      var rightShoulder = keypoints.filter(function (item: any) {
        return item.name === "left_shoulder";
      });
      // console.log('rightShoulder: ', rightShoulder[0].x, rightShoulder[0].y);

      // Right Elbow
      var rightElbow = keypoints.filter(function (item: any) {
        return item.name === "left_elbow";
      });
      // console.log('rightElbow: ', rightElbow[0].x , rightElbow[0].y);

      console.log(skipFrameCount);

      if (rightShoulder[0].y > rightElbow[0].y && skipFrameCount === 0) {
        console.log("I am here");

        skipFrameCount = skipFrameCount + 1;

        let totalServesTemp = totalServes + 1;
        setTotalServes(totalServesTemp);
        // Alert.alert(JSON.stringify(canAdd));
        // Alert.alert(JSON.stringify(timerSeconds));
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

      // Set initial orientation.
      const curOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(curOrientation);

      // Listens to orientation change.
      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();

      // Load movenet model.
      // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection

      // const model = await posedetection.createDetector(
      //   // posedetection.SupportedModels.MoveNet,
      //   posedetection.SupportedModels.BlazePose,
      //   detectorConfig
      // );
      setModel(PoseNetModal);
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

      // const res = model_tos.predict(tf.randomNormal(test_pose)) as tf.Tensor;

      // let x = tf.tensor([null,test_pose]);

      // let x = tf.tensor([test_pose]).reshape([-1, 99]);

      // const res = model_tos.predict(x) as tf.Tensor;

      // const values = res.dataSync();
      // const arr = Array.from(values);
      // // console.log(values);
      // console.log(arr[0]);

      // x.shape;

      // console.log(x.shape);
      // console.log(res);

      // const tosDetector = await tf.loadLayersModel(
      //   bundleResourceIO(model_json, model_weight)
      // );

      setTypeOfServeDetector(model_tos);

      // console.log("Model Successfully loaded", tosDetector);

      // Ready!
      setTfReady(true);
    }

    prepare();
  }, []);

  useEffect(() => {
    // Called when the app is unmounted.
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
      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;

      const startTs = Date.now();
      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now()
      );

      // shotDetection(poses);
      // serveTypeDetection(poses);
      calibrate(poses);
      if(isCalibrated && !isCompletedRecording){
        serveTypeDetectionthreshold(poses)
      } else if (isCompletedRecording) {
        addVideoToFirebase()
        isCompletedRecording = false
      }
      // shotDetection(poses);



      const latency = Date.now() - startTs;
      setFps(Math.floor(1000 / latency));
      setPoses(poses);
      tf.dispose([imageTensor]);

      if (rafId.current === 0) {
        return;
      }

      // Render camera preview manually when autorender=false.
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
    // Alert.alert('Stopping');
    // 1. Add to firebase.
    // 2. Add in the list of analysis cards
    // 3. 
    addVideoToFirebase();
  };

  const startRecording = () => {

  }

  const stopRecording = () => {
    // Stop Calibrating
    // Stop counting
    // Stop grading
    // Finalize video
    // Upload to firebase

    addVideoToFirebase();
  }

  const addVideoSuccess = (video?:any) => {
    console.log("Added: ", JSON.stringify(video));

    Alert.alert("Trainify", `Video added successfully.`);
    navigation.goBack();

    // if (video){
    //   navigation.navigate('VideoPlayerContainer', {video:response.assets[0]});
    // }
    // if (video) {
    //   Alert.alert("Trainify", `Video added successfully.`);
    // }

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

    // uploadVideoService(response, addVideoSuccess, addVideoFailure);
      addVideoService(tempVideoData, addVideoSuccess, addVideoFailure);
  }

  const renderRecordButton = () => {
    return (
      <View
        style={styles.cameraRecordButton}
        onTouchEnd={handleStopCamera}
      >
        <Text>
          Stop Recording{" "}
        </Text>
      </View>
    );
  };

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
    // On iOS landscape mode, switch width and height of the output tensor to
    // get better result. Without this, the image stored in the output tensor
    // would be stretched too much.
    //
    // Same for getOutputTensorHeight below.
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
    // On Android, the camera texture will rotate behind the scene as the phone
    // changes orientation, so we don't need to rotate it in TensorCamera.
    if (IS_ANDROID) {
      return 0;
    }

    // For iOS, the camera texture won't rotate automatically. Calculate the
    // rotation angles here which will be passed to TensorCamera to rotate it
    // internally.
    switch (orientation) {
      // Not supported on iOS as of 11/2021, but add it here just in case.
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


/* Timer start*/
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
  let { total, hours, minutes, seconds } 
              = getTimeRemaining(e);
  if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to 
      // add '0' at the begining of the variable
      // setTimer(
      //     (hours > 9 ? hours : '0' + hours) + ':' +
      //     (minutes > 9 ? minutes : '0' + minutes) + ':'
      //     + (seconds > 9 ? seconds : '0' + seconds)
      // )
      // setTimer(JSON.stringify(total));
      setSeconds(seconds);
  }
}


const clearTimer = (e) => {
  // If you adjust it you should also need to
  // adjust the Endtime formula we are about
  // to code next    
  // setTimer('10000');
  setSeconds(10);

  // If you try to remove this line the 
  // updating of timer Variable will be
  // after 1000ms or 1sec
  if (Ref.current) clearInterval(Ref.current);
  const id = setInterval(() => {
      startTimer(e);
  }, 1000)
  Ref.current = id;
}

const getDeadTime = () => {
  let deadline = new Date();

  // This is where you need to adjust if 
  // you entend to add more time
  deadline.setSeconds(deadline.getSeconds() + 10);
  return deadline;
}

// We can use useEffect so that when the component
// mount the timer will start as soon as possible

// We put empty array to act as componentDid
// mount only
useEffect(() => {
  clearTimer(getDeadTime());
}, []);

// Another way to call the clearTimer() to start
// the countdown is via action event from the
// button first we create function to be called
// by the button 
const onClickReset = () => {
  clearTimer(getDeadTime());
}
/* Timer end */

useEffect(() => {
  setCalibrated(calibrated);
}, [calibrated])

useEffect(()=> {
  if (timerSeconds >= 2){
    setCanAdd(false);
  } else if (timerSeconds < 2) {
    setCanAdd(true)
    // Alert.alert('Can add.')
  }
},[timerSeconds])

useEffect(() => {
  if (tfReady) {
    clearTimer(getDeadTime());
  }
}, [tfReady]);

  if (!tfReady) {
    return (
      <View style={styles.loadingMsg}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      // Note that you don't need to specify `cameraTextureWidth` and
      // `cameraTextureHeight` prop in `TensorCamera` below.
      <View
        style={
          isPortrait() ? styles.containerPortrait : styles.containerLandscape
        }
      >
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          // tensor related props
          resizeWidth={getOutputTensorWidth()}
          resizeHeight={getOutputTensorHeight()}
          resizeDepth={3}
          rotation={getTextureRotationAngleInDegrees()}
          onReady={handleCameraStream}
        />
        {renderPose()}
        {renderFps()}
        {renderCalibration()}
        {renderCameraTypeSwitcher()}
        {isCalibratedr && renderRecordButton()}
      </View>
    );
  }
}

export default UsamaCameraContainer;

const styles = StyleSheet.create({
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
  loadingMsg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  svg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 30,
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
  },

  cameraRecordButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 180,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
});