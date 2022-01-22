import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SCREEN_WIDTH} from '../../constants';

const logo = require('../../assets/images/logo.png');
const splashScreen = require('../../assets/images/splash-screen.png');

const HomeScreen: FunctionComponent = ({ navigation }) => {
  // const navigation = useNavigation();
  
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Signin');
    },2500);
  });

  return(
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50}}>
        <Image source={logo} style={{width: 268, height: 86,}}/>
      </View>
    </View>
  )
};
export default HomeScreen;
