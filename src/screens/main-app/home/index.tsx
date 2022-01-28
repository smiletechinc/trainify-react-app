import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../../constants';
import Header from '../../../global-components/header';
import styles from '../styles';

const HomeScreen: FunctionComponent = ({ navigation }) => {
  // const navigation = useNavigation();
  useEffect(() => {
  });

  return(
    <View style={styles.home_main_view}>
      <Header />
    </View>
  )
};
export default HomeScreen;
