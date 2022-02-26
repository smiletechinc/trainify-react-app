import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SCREEN_WIDTH} from '../../constants';
import { RootState } from '../../../store';
import { useSelector} from 'react-redux';
import * as tf from "@tensorflow/tfjs";
import * as posenet from '@tensorflow-models/posenet';
import * as posedetection from "@tensorflow-models/pose-detection";
import '@tensorflow/tfjs-react-native';

import {useDispatch} from 'react-redux';
import {setPoseNetModal} from '../../redux/slices/AuthSlice';

require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const logo = require('../../assets/images/logo.png');
const splashScreen = require('../../assets/images/splash-screen.png');

const SplashScreenContainer: FunctionComponent = ({ navigation }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const UserData = useSelector((state: RootState) => state.RegisterReducer.UserData);
  const loadPosenetModel = async () => {
    const model = posedetection.SupportedModels.BlazePose;
      const detectorConfig = {
        runtime: "tfjs", // or 'tfjs'
        modelType: "full",
      };

      const detector = await posedetection.createDetector(
        model,
        detectorConfig
      );
    console.log('detector model: ', model);
    dispatch(setPoseNetModal(detector));
    
  };
  useEffect(() => {
    (async () => {
      await tf.ready().then(tf1 => {
        loadPosenetModel();
      });
    })();
    setTimeout(() => {
      if(UserData === null) {
        navigation.navigate('LanguageScreen');
      }
      else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
        // navigation.navigate('MainApp');
      }
     
    },2500);
  });

  return(
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50}}>
        <Image source={logo} style={{width: 268, height: 86,}}/>
      </View>
      
      {/* <View style={{flexDirecton: 'row', alignItems: 'flex-end'}}>
        <Image source={splashScreen} style={{width: '100%', height: 331,}}/>
      </View> */}
    </View>
  )
};
export default SplashScreenContainer;
