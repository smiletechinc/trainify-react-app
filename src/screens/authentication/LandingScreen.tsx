import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants';
import {SimpleButton} from '../../global-components/button';
import styles from './styles';
const LandingPageBackground = require('../../assets/images/landing-page.png');

const LandingScreenContainer: FunctionComponent = ({ navigation }) => {
  // const navigation = useNavigation();
  
  useEffect(() => {

  });

  return(
    <ImageBackground
      source={LandingPageBackground}
      resizeMode="cover"
      style={styles.landing_image_background}
      imageStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
    >
      <View style={styles.main_view_container}>
        <SimpleButton
          buttonText="Sign In"
          buttonType={"PRIMARY"}
          onPress={()=>{
            // console.log()
            navigation.navigate('Signin');
          }}
          buttonTextStyles={{
            fontWeight: 'bold',
          }}
        />
        <SimpleButton
          buttonText="Sign Up"
          buttonType={"PRIMARY"}
          onPress={()=>{
            // console.log()
            navigation.navigate('Signup');
          }}
          buttonStyles={{
            marginTop: 29,
          }}
          buttonTextStyles={{
            fontWeight: 'bold',
          }}
        />
      </View>
    </ImageBackground>
  )
};
export default LandingScreenContainer;
