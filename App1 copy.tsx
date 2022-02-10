/* eslint-disable react-native/no-inline-styles */
import React, {Component, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
// import {ScaledSheet} from 'react-native-size-matters';
import {Camera} from 'expo-camera';
import Canvas from 'react-native-canvas';

import * as tf from '@tensorflow/tfjs';
import {
  cameraWithTensors,
  decodeJpeg,
  fetch,
} from '@tensorflow/tfjs-react-native';

import * as posenet from '@tensorflow-models/posenet';
import * as blazeface from '@tensorflow-models/blazeface';
import {PoseDetector} from '@tensorflow-models/pose-detection';
// import * as poseDetection from '@tensorflow-models/pose-detection';

require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const similarity = require('compute-cosine-similarity');
const simplePose = require('./simple-pose.png');

const TensorCamera = cameraWithTensors(Camera);

const CAM_WIDTH = Dimensions.get('window').width;
const CAM_HEIGHT = Dimensions.get('window').height;
const inputTensorWidth = 150;
const inputTensorHeight = 200;
const AUTORENDER = true;

export default function CameraScreen() {
  // const [hasPermission, setHasPermission] = useState(null);
  // const [type, setType] = useState(Camera.Constants.Type.back);
  const [isLoaded, setLoaded] = React.useState(false);
  const [modal, setModal] = React.useState<any>();
  const [singlePose, setSinglePose] = React.useState();
  const [ctx, setCanvasContext] = useState(null);

  const [textureDims, setTextureDims] = useState({});
  const loadCocoModal = async () => {
    const model = await cocoSsd.load();
    setModal(model);
    setLoaded(true);
  };
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
    console.log(`${x1}, ${y1}, ${x2}, ${y2}`);
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
      console.log(keypoint);
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
  useEffect(() => {
    let isMounted = true;
    if (Platform.OS === 'ios') {
      setTextureDims({height: CAM_HEIGHT, width: CAM_WIDTH});
    } else {
      setTextureDims({height: CAM_HEIGHT, width: CAM_WIDTH});
    }

    (async () => {
      // console.log('here...')

      await tf.ready().then((tf) => {
        // loadBlazefaceModel();
        loadPosenetModel();
        // loadCocoModal();
      });
      // await tf.setbackend()
    })();

    const loadBlazefaceModel = async () => {
      const model = await blazeface.load();
      return model;
    };

    // await tf.ready().then((tf) => {
    //     console.log('tf...', tf)
    //     if (isMounted) {
    //         setLoaded(true);
    //     }
    // });
    // (async () => {
    //   const { status } = await Camera.requestPermissionsAsync();
    //   setHasPermission(status === 'granted');
    // })();
  }, []);
  //   if (hasPermission === null) {
  //     return <View />;
  //   }
  //   if (hasPermission === false) {
  //     return <Text>No access to camera</Text>;
  //   }
  function cosineDistanceMatching(poseVector1, poseVector2) {
    let cosineSimilarity = similarity(poseVector1, poseVector2);
    // return cosineSimilarity;

    let distance = 2 * (1 - cosineSimilarity);
    return Math.sqrt(distance);
  }

  const handleImageTensorReady = (images, updateCameraPreview, gl) => {
    const loop = async () => {
      const modelName = 'posenet';
      if (modelName === 'posenet') {
        const imageTensor = images.next().value;
        // const imageUri1 =
        //   'https://image.shutterstock.com/image-photo/full-body-black-man-600w-770647549.jpg';
        // // const imageUri1 = simplePose;
        // const imageUri2 =
        //   'https://image.shutterstock.com/image-photo/black-man-full-body-600w-624898259.jpg';
        // const response1 = await fetch(imageUri1, {}, {isBinary: true});
        // const response2 = await fetch(imageUri2, {}, {isBinary: true});

        // const imageDataArrayBuffer1 = await response1.arrayBuffer();
        // const imageDataArrayBuffer2 = await response2.arrayBuffer();

        // const imageData1 = new Uint8Array(imageDataArrayBuffer1);
        // const imageData2 = new Uint8Array(imageDataArrayBuffer2);

        // const imageTensor1 = decodeJpeg(imageData1, 3);
        // const imageTensor2 = decodeJpeg(imageData2, 3);


        // console.log('image tensor: ', imageTensor2);
        const flipHorizontal = Platform.OS === 'ios' ? true : true;
        if (modal) {
          const pose1 = await modal.estimateSinglePose(imageTensor, {
            flipHorizontal,
          });
          // const pose2 = await modal.estimateSinglePose(imageTensor2, {
          //   flipHorizontal,
          // });

          setSinglePose({pose1});
          ctx.clearRect(0, 0, CAM_WIDTH, CAM_HEIGHT);
          await drawSkeleton(pose1);
          tf.dispose([imageTensor]);

          // let poseVector1 = [];
          // let poseVector2 = [];
          // for (const pose of pose1.keypoints) {
          //   poseVector1.push(pose.position.x);
          //   poseVector1.push(pose.position.y);
          //   // console.log('position: ', pose.position.x);
          // }
          // for (const pose of pose2.keypoints) {
          //   poseVector2.push(pose.position.x);
          //   poseVector2.push(pose.position.y);
          //   // console.log('position: ', pose.position.x);
          // }
          // const distance = cosineDistanceMatching(poseVector1, poseVector2);
          // if (distance <= 0.11) {
          //   // console.log('cosine_similarity: ', distance);
          //   // console.log('--------', distance);
          // } else {
          //   // console.log('cosine_similarity: ', distance);
          //   // console.log('No Match', distance);
          // }

          // // console.log('pose vector 2: ', poseVector2);
        }

        //   const imageTensor = images.next().value;
        //   const flipHorizontal = Platform.OS === 'ios' ? true : true;
        //   const pose = await modal.estimateSinglePose(imageTensor, {
        //     flipHorizontal,
        //   });
        //   console.log('images: ', pose);
        //   setSinglePose({pose});
        //   // handleCanvas();
        //   // const context = ctx.getContext('2d');
        //   ctx.clearRect(0, 0, CAM_WIDTH, CAM_HEIGHT);

        //   // await drawSkeleton(pose);

        //   tf.dispose([imageTensor]);
      } else if (modelName === 'coco') {
        const imageTensor = images.next().value;
        let personObjject = {};
        console.log('4D....', imageTensor);
        // const newImageTensor = imageTensor.reshape([3, 3], [-1]);
        // console.log('3D....', newImageTensor);


        const predictions = await modal.detect(imageTensor);

        // for (let i = 0; i < predictions.length; i++) {
        //   if (predictions[i].class === 'person') {
        //     personObjject = predictions[i];
        //     break;
        //   }
        // }
        // console.log('Person: ', personObjject);

        // tf.image.cropAndResize(
        //   imageTensor.reshape([4, 4], [-1]),
        //   [personObjject.bbox, [1, 4]],
        //   [1],
        //   [200, 200],
        // );
      }

      if (!AUTORENDER) {
        gl.endFrameEXP();
      }
      requestAnimationFrame(loop);
    };

    loop();
    // }
  };

  const camView = () => {
    // console.log('textureDims.height: ', textureDims.width);
    return (
      <TensorCamera
        // Standard Camera props
        style={styles.camera}
        type={Camera.Constants.Type.back}
        // zoom={0}
        // tensor related props
        cameraTextureHeight={CAM_HEIGHT}
        cameraTextureWidth={CAM_WIDTH}
        resizeHeight={160}
        resizeWidth={220}
        resizeDepth={3}
        onReady={handleImageTensorReady}
        autorender={false}
      />
    );
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.text}>Loading Tensor Flow</Text>
          <ActivityIndicator />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.camera}>
      {camView()}
      <Canvas ref={handleCanvas} style={styles.canvas} />
      {/* <Text>Welcome to Kalanit</Text> */}
      {/* <Camera style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}>
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    // try flex 1
    width: CAM_WIDTH,
    height: CAM_HEIGHT,
    zIndex: 200,
    // borderWidth: 2,
    // borderColor: 'red',
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
    height: '100%',
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // overflow: 'visible'
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
    color: 'black',
  },
});
