import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, Image} from 'react-native';
// import {RootState} from '../../../store';
import {connect} from 'react-redux';
import {useSelector} from 'react-redux';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-react-native';

import {useDispatch} from 'react-redux';
import {AuthContext} from '../../context/auth-context';
// import {setPoseNetModal} from '../../redux/slices/AuthSlice';

require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const logo = require('../../assets/images/logo.png');
const splashScreen = require('../../assets/images/splash-screen.png');

type Props = {
  navigation: any;
  userAuthentication: any;
  // updateColors: any,
  // updateReduxColors: any,
};
const SplashScreenContainer: FunctionComponent<Props> = props => {
  const {navigation, userAuthentication} = props;
  const {authUser, setAuthUser, setAuthObject} = React.useContext(AuthContext);
  const [animating, setAnimating] = useState(false);
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  // const UserData = useSelector(
  //   (state: RootState) => state.RegisterReducer.UserData,
  // );
  const loadPosenetModel = async () => {
    const model = posedetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: 'tfjs', // or 'tfjs'
      modelType: 'full',
    };

    const detector = await posedetection.createDetector(model, detectorConfig);
    console.log('detector model: ', model);
    // dispatch(setPoseNetModal(detector));
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimating(true);
      if (userAuthentication.email != 'null') {
        console.log('userAuthentication from Redux', userAuthentication);
        // updateColors()
        // fetchColorsService(fetchColorsSuccess, fetchColorsSuccessFailure)  //call reducrer action
        // navigation.replace('MainApp', userAuthentication.id);
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: 'MainApp'}],
        // });n
        setAuthObject(userAuthentication);
        navigation.replace('MainApp', userAuthentication.id);
      } else {
        console.log(
          'userAuthentication from Redux in false condition',
          userAuthentication,
        );
        navigation.replace('Signin');
      }
    }, 2000);
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     await tf.ready().then(tf1 => {
  //       loadPosenetModel();
  //     });
  //   })();
  //   setTimeout(() => {
  //     // Getting user from redux
  //     if (UserData) {
  //       navigation.reset({
  //         index: 0,
  //         routes: [{name: 'MainApp'}],
  //       });
  //     } else {
  //       navigation.navigate('Signin');
  //     }
  //   }, 2500);
  // }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 50,
        }}>
        <Image source={logo} style={{width: 268, height: 86}} />
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  console.log(
    'Redux user props are comes:',
    JSON.stringify(state.userlogin.authUser),
  );
  return {
    userAuthentication: state.userlogin.authUser,
  };
};

export default connect(mapStateToProps)(SplashScreenContainer);
