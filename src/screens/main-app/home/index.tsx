import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AutoHeightImage from 'react-native-auto-height-image';

import {COLORS, SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../../constants';
import Header from '../../../global-components/header';
import styles from '../styles';
import globalStyles from '../../../global-styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const servePracticeImage = require('../../../assets/images/serve-practice.png');
const practiceWithBall = require('../../../assets/images/practice-with-ball.png');
const practiceAtHome = require('../../../assets/images/practice-at-home.png');

const HomeScreen: FunctionComponent = ({ navigation }) => {
  // const navigation = useNavigation();
  useEffect(() => {
  });

  return(
    <View style={styles.home_main_view}>
      <KeyboardAwareScrollView>
        <Header />
        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 60,
          }}
          onPress={()=>{
            navigation.navigate('ServePractice')
          }}
        >
          <AutoHeightImage source={servePracticeImage} width={SCREEN_WIDTH * 0.9} />
          <Text style={[globalStyles.h1, styles.practice_text]}>Serve Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 26,
          }}
        >
          <AutoHeightImage source={practiceWithBall} width={SCREEN_WIDTH * 0.9} />
          <Text style={[globalStyles.h1, styles.practice_text]}>Practice with Ball Machine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 26,
          }}
        >
          <AutoHeightImage source = {practiceAtHome} width = {SCREEN_WIDTH * 0.9} />
          <Text style={[globalStyles.h1, styles.practice_text]}>Practice at Home/ Posture Workout</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  )
};
export default HomeScreen;