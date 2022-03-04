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
import Canvas from 'react-native-canvas';
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';
// const tf = require('@tensorflow/tfjs');
import {cameraWithTensors, decodeJpeg, fetch} from '@tensorflow/tfjs-react-native';
const TensorCamera = cameraWithTensors(Camera);
import { ExpoWebGLRenderingContext } from 'expo-gl';
const CAM_WIDTH = Dimensions.get('window').width;
const CAM_HEIGHT = Dimensions.get('window').height;
const AUTO_RENDER = false;

import styles_external from '../../styles';
import globalStyles from '../../../../global-styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderWithText from '../../../../global-components/header/HeaderWithText';
import { IconButton } from '../../../../components/buttons'

const recordIcon = require('../../../../assets/images/icon_record_start.png');
const stopIcon = require('../../../../assets/images/icon_record_stop.png');

export default function TensorFlowCameraContainer({navigation, route}) {
  const {title} = route.params
  const [isLoaded, setLoaded] = React.useState(false);
  const rafId = useRef<number | null>(null);
  const [setup, setSetup] = useState(false);
  const [modal, setModal] = React.useState<any>();
  const [singlePose, setSinglePose] = React.useState();
  const [ctx, setCanvasContext] = useState(null);
  const loadPosenetModel = async () => {
    // const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet,
    // {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER});
    const model = await posenet.load({
      architecture: 'ResNet50',
      outputStride: 16,
      inputResolution: 220,
      multiplier: 1,
      quantBytes: 4,
    });
    console.log('loadPosenetModel....model', model);
    setModal(model);
    setLoaded(true);
    // return model;
  };
  const handleCanvas = (canvas) => {
    if (canvas === null) {
      return;
    }
    const context = canvas.getContext('2d');
    setCanvasContext(context);
  };
  const drawPoint = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#10f400';
    ctx.fill();
    ctx.closePath();
  };

  const drawSegment = (x1, y1, x2, y2) => {
    // console.log(`${x1}, ${y1}, ${x2}, ${y2}`);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff30';
    ctx.stroke();
    ctx.closePath();
  };

  const drawSkeleton = (pose) => {
    console.log(pose);
    const minPartConfidence = 0.8;
    for (let i = 0; i < pose.keypoints.length; i++) {
      const keypoint = pose.keypoints[i];
      if (keypoint.score < minPartConfidence) {
        continue;
      }
      drawPoint(keypoint.position.x, keypoint.position.y);
    }
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
      pose.keypoints,
      minPartConfidence,
    );
    adjacentKeyPoints.forEach((keypoints) => {
      drawSegment(
        keypoints[0].position.x,
        keypoints[0].position.y,
        keypoints[1].position.x,
        keypoints[1].position.y,
      );
    });
  };
  const handleImageTensorReady = (images, updateCameraPreview, gl) => {
    const loop = async () => {
      const modelName = 'posenet';

      if (modelName === 'posenet') {
        const imageTensor = images.next().value;
       
        // console.log('image tensor: ', imageTensor2);
        const flipHorizontal = Platform.OS === 'ios' ? true : true;
        if (modal) {
          const pose1 = await modal.estimateSinglePose(imageTensor, {
            flipHorizontal,
          });
        
          setSinglePose({pose1});
          ctx.clearRect(0, 0, CAM_WIDTH, CAM_HEIGHT);
          await drawSkeleton(pose1);
          tf.dispose([imageTensor]);
        }

       
      } else if (modelName === 'coco') {
        const imageTensor = images.next().value;
        let personObjject = {};
        console.log('4D....', imageTensor);
        const newImageTensor = imageTensor.reshape([3, 3], [-1]);
        console.log('3D....', newImageTensor);
      }

      if (!AUTO_RENDER) {
        gl.endFrameEXP();
      }
      requestAnimationFrame(loop);
    };

    loop();
    // }
  };
  function init() {
    setSetup(true);
  }
 function setupTensorflow() {
       let isMounted = true;
      // console.log('tf...', tf);

      (async () => {
      await tf.ready().then((tf) => {
        // console.log('tf...', tf)
        if (isMounted) {
          loadPosenetModel();
          
          // setLoaded(true);
        }
    });
    })();
}

function stopTensorflow() {
  if (rafId.current != null && rafId.current !== 0) {
    cancelAnimationFrame(rafId.current);
    rafId.current = 0;
  }
  setLoaded(false);

//   // (async () => {
//   //   const { status } = await Camera.requestPermissionsAsync();
//   //   setHasPermission(status === 'granted');
//   // })();
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
        type={Camera.Constants.Type.back}
        zoom={0}
        // tensor related props
        cameraTextureHeight={CAM_HEIGHT}
        cameraTextureWidth={CAM_WIDTH}
        resizeHeight={300}
        resizeWidth={300 * 0.75}
        resizeDepth={3}
        onReady={handleImageTensorReady}
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
    // return (
    //   <SafeAreaView style={styles_external.main_view}>
    //     <HeaderWithText
    //       text = "RECORD LEFT-HANDED SERVE"
    //       hideProfileSection = {true}
    //       navigation={navigation}
    //     />
              
    //          <View style={styles.cameraContainer}>
    //     {isLoaded && camView()}
    //     <View style={styles.buttonContainer}>
    //   {/* <IconButton styles={styles.recordIconStyle}  icon={stopIcon} onPress={() => {setupTensorflow()}} transparent={false}/> */}
    //   <IconButton styles={styles.recordIcon} icon={isLoaded ? stopIcon : recordIcon} onPress={() => {!isLoaded ? setupTensorflow() : stopTensorflow()} } transparent={true} />
    //   </View>
    //   </View>
      
    // </SafeAreaView>

    // );

        return (
      <SafeAreaView style={styles_external.main_view}>
        <HeaderWithText
          text = {title}
          hideProfileSection = {true}
          navigation={navigation}
        />
              <View style={styles.cameraView} >
             <View style={styles.cameraContainer}>
               
               {isLoaded && camView()}
               </View>
        <View style={styles.buttonContainer}>
          <IconButton styles={styles.recordIcon} icon={isLoaded ? stopIcon : recordIcon} onPress={() => {!isLoaded ? setupTensorflow() : stopTensorflow()} } transparent={true} />
      </View>
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
  cameraView: {
    display:'flex',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  camera: {
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    overflow: 'hidden',
    backgroundColor:'blue',
    // height: CAM_HEIGHT,
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
});