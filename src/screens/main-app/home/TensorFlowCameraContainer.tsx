import React, {Component, useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Platform,
  Dimensions,
  Button,
} from 'react-native';
import {Camera} from 'expo-camera';
// import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';  // <-- This is important
const tf = require('@tensorflow/tfjs');
import {cameraWithTensors, decodeJpeg, fetch} from '@tensorflow/tfjs-react-native';
const TensorCamera = cameraWithTensors(Camera);
import { ExpoWebGLRenderingContext } from 'expo-gl';
import * as posedetection from '@tensorflow-models/pose-detection';
import Svg, { Circle } from 'react-native-svg';
import styles_external from '../styles';
import globalStyles from '../../../global-styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderWithText from '../../../global-components/header/HeaderWithText';
import { IconButton } from '../../../components/buttons'
const recordIcon = require('../../../assets/images/icon_record_start.png');
const stopIcon = require('../../../assets/images/icon_record_stop.png');

const CAM_WIDTH = Dimensions.get('window').width;
const CAM_HEIGHT = Dimensions.get('window').height;
const AUTO_RENDER = false;
const MIN_KEYPOINT_SCORE = 0.3;
const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';
const OUTPUT_TENSOR_WIDTH = 180;
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);
const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (IS_IOS ? 9 / 16 : 3 / 4);

export default function TensorFlowCameraContainer() {
  const [isLoaded, setLoaded] = React.useState(false);
  const rafId = useRef<number | null>(null);
  const [setup, setSetup] = useState(false);

  const cameraRef = useRef(null);
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState<posedetection.PoseDetector>();
  const [poses, setPoses] = useState<posedetection.Pose[]>();
  const [fps, setFps] = useState(0);

  // const [skipFrameCount, setSkipFrameCount] = useState(0);
  let skipFrameCount = 0;
  const [totalServes, setTotalServes] = useState(0);
  // const [cameraType, setCameraType] = useState<CameraType>(
  //   Camera.Constants.Type.front
  // );

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    const loop = async () => {
      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;

      console.log('imageTensor: ', imageTensor);

      const startTs = Date.now();
      const poses = await model!.estimatePoses(
        imageTensor,
        undefined,
        Date.now()
      );
      
console.log('poses: ', poses);

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

const isPortrait = () => {
  return true;
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

  const renderPose = () => {
    if (poses != null && poses.length > 0) {
      const keypoints = poses[0].keypoints
        .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
        .map((k) => {
          // Flip horizontally on android or when using back camera on iOS.
          const flipX = IS_ANDROID;
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
              r='4'
              strokeWidth='2'
              fill='#00AA00'
              stroke='white'
            />
          );
        });

      return <Svg style={styles.svg}>{keypoints}</Svg>;
    } else {
      return <View><Text>No data available</Text></View>;
    }
  };

  function init() {
    setSetup(true);
  }
 function setupTensorflow() {
    //    let isMounted = true;

    //   (async () => {
    //   await tf.ready().then((tf) => {
    //     console.log('tf...', tf)
    //     if (isMounted) {
    //         setLoaded(true);
    //     }
    // });
    // })();

  
    //   (async () => {
    //     const model = posedetection.SupportedModels.BlazePose;
    //     const detectorConfig = {
    //       runtime: 'tfjs', // or 'tfjs'
    //       modelType: 'full'
    //     };
    //     console.log('detectorConfig: ', detectorConfig);
    //   const detector = await posedetection.createDetector(model, detectorConfig);
    //   console.log('detector: ', detector);
    //   setModel(detector);

    //   // Ready!
   
    // })();
    //   // const model = await posedetection.createDetector(
    //   //   // posedetection.SupportedModels.MoveNet,
    //   //   posedetection.SupportedModels.BlazePose,
    //   //   detectorConfig
    //   // );
    //   setTfReady(true);
    //   console.log('Model loaded!: ');

    async function prepare() {
      rafId.current = null;

      // Set initial orientation.

      // Camera permission.
      await Camera.requestCameraPermissionsAsync();

      // Wait for tfjs to initialize the backend.
      await tf.ready();
      setLoaded(true);

      // Load movenet model.
      // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection

      const model = posedetection.SupportedModels.BlazePose;
      const detectorConfig = {
        runtime: 'tfjs', // or 'tfjs'
        modelType: 'full'
      };

      const detector = await posedetection.createDetector(model, detectorConfig);
      // const model = await posedetection.createDetector(
      //   // posedetection.SupportedModels.MoveNet,
      //   posedetection.SupportedModels.BlazePose,
      //   detectorConfig
      // );

      setModel(detector);
      // Ready!
      setTfReady(true);
    }

    prepare();

}

function stopTensorflow() {
  setLoaded(false);
}
  // useEffect(() => {
  //   let isMounted = true;
  //   console.log('tf...', tf);
  //   (async () => {
  //     await tf.ready().then((tf) => {
  //       console.log('tf...', tf)
  //       if (isMounted) {
  //           setLoaded(true);
  //       }
  //   });
  //   })();
  //   // (async () => {
  //   //   const { status } = await Camera.requestPermissionsAsync();
  //   //   setHasPermission(status === 'granted');
  //   // })();
  // }, []);
  const camView = () => {
    // console.log('textureDims.height: ', textureDims.width);
    return (
      <TensorCamera
        // Standard Camera props
        style={styles.camera}
        type={Camera.Constants.Type.front}
        // zoom={0}
        // tensor related props
        // cameraTextureHeight={CAM_HEIGHT}
        // cameraTextureWidth={CAM_WIDTH}
        resizeHeight={300}
        resizeWidth={300 * 0.75}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={false}
      />
    );
  };
  // if (!setSetup) {
  //   <View style={styles.container}>
  //   <View style={{flexDirection: 'column'}}>
  //     <Text style={styles.text}>Click to initialize</Text>
  //     <Button title='Initialize' onPress={init}/>
  //   </View>
  // </View>
  // } else
  // if (!isLoaded) {
  //   return (
  //     <View style={styles.container}>
  //       <View style={{flexDirection: 'column'}}>
  //         <Text style={styles.text}>Open Camera to setup Tensor Flow</Text>
  //         <Button title='Camera' onPress={() => {setupTensorflow();}}/>
  //       </View>
  //     </View>
  //   );
  // } else {
    return (
      <SafeAreaView style={styles_external.main_view}>
        <HeaderWithText
          text = "RECORD LEFT-HANDED SERVE"
          hideProfileSection = {true}
          // navigation={navigation}
        />
             <View style={styles.cameraContainer}>
               <View>
               {isLoaded && camView()}
        {isLoaded && renderPose()}
               </View>

               <IconButton styles={styles.recordIcon} icon={isLoaded ? stopIcon : recordIcon} onPress={() => {!isLoaded ? setupTensorflow() : stopTensorflow()} } transparent={true} />

      </View>
    </SafeAreaView>


    );
  // }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent:'center',
    justifyContent:'center',
    backgroundColor:'yellow',
  },
  canvas: {
     // try flex 1
    width: CAM_WIDTH,
    height: CAM_HEIGHT,
    zIndex: 200,
    borderWidth: 2,
    borderColor: 'red',
    // background
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    paddingTop: 20,
    overflow: 'visible',
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
  camera: {
    width:'100%',
    height:'100%',
    alignItems:'center',
justifyContent:'center',
    overflow: 'hidden',
    backgroundColor:'blue',
    // height: CAM_HEIGHT,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
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
  recordIcon: {
    width: 60,
    height: 60,
    position:'absolute',
    bottom:36,
    zIndex:1000,
  },
  svg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 30,
  },
});