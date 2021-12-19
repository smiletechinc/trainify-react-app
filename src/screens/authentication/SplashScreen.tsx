import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator,View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const SplashScreenContainer: FunctionComponent = ({ navigation }) => {
  // const navigation = useNavigation();
  
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Authentication');
      
    },2500);
  });

  return(
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Splash screen</Text>
    </View>
  )
};
export default SplashScreenContainer;
