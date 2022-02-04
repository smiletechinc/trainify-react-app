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
const tf = require('@tensorflow/tfjs');
import {cameraWithTensors, decodeJpeg, fetch} from '@tensorflow/tfjs-react-native';
const TensorCamera = cameraWithTensors(Camera);
import { ExpoWebGLRenderingContext } from 'expo-gl';
const CAM_WIDTH = Dimensions.get('window').width;
const CAM_HEIGHT = Dimensions.get('window').height;
const AUTO_RENDER = false;

import styles_external from '../styles';
import globalStyles from '../../../global-styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderWithText from '../../../global-components/header/HeaderWithText';
import { IconButton } from '../../../components/buttons'
const recordIcon = require('../../../assets/images/record-icon.png');

export default function TensorFlowCameraContainer() {
  const [isLoaded, setLoaded] = React.useState(false);
  const rafId = useRef<number | null>(null);
  const [setup, setSetup] = useState(false);
  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext
  ) => {
    const loop = async () => {
      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D;
      // Render camera preview manually when autorender=false.
      if (!AUTO_RENDER) {
        updatePreview();
        gl.endFrameEXP();
      }
      rafId.current = requestAnimationFrame(loop);
    };
    loop();
  };
  function init() {
    setSetup(true);
  }
 function setupTensorflow() {
       let isMounted = true;
  console.log('tf...', tf);

      (async () => {
      await tf.ready().then((tf) => {
        console.log('tf...', tf)
        if (isMounted) {
            setLoaded(true);
        }
    });
    })();

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
        {isLoaded && camView()}
        
      </View>
      <IconButton icon={recordIcon} onPress={() => {setupTensorflow()}} />
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
    bottom:20,
    left:12,
    zIndex:1000,
  }
});