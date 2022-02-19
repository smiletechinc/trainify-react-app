import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SCREEN_WIDTH} from '../../constants';
import { RootState } from '../../../store';
import { useSelector} from 'react-redux';

const logo = require('../../assets/images/logo.png');
const splashScreen = require('../../assets/images/splash-screen.png');

const SplashScreenContainer: FunctionComponent = ({ navigation }) => {
  // const navigation = useNavigation();
  const UserData = useSelector((state: RootState) => state.RegisterReducer.UserData);
  useEffect(() => {
    setTimeout(() => {
      if(UserData === null) {
        navigation.navigate('LanguageScreen');
      }
      else {
        navigation.navigate('HomeScreen');
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
