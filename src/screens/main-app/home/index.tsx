import React, {FunctionComponent, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {SCREEN_WIDTH} from '../../../constants';
import Header from '../../../global-components/header';
import styles from '../styles';
import globalStyles from '../../../global-styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HeaderWithText from '../../../global-components/header/HeaderWithText';
import RecordScreen from 'react-native-record-screen';

const servePracticeImage = require('../../../assets/images/serve-practice.png');
const practiceWithBall = require('../../../assets/images/practice-with-ball.png');
const practiceAtHome = require('../../../assets/images/practice-at-home.png');

type Props = {
  navigation: any;
};

const HomeScreen: FunctionComponent<Props> = ({navigation}) => {
  useEffect(() => {
    RecordScreen.startRecording({mic: false});
  }, []);

  return (
    <View style={styles.home_main_view}>
      <KeyboardAwareScrollView>
        <HeaderWithText
          text={''}
          navigation={navigation}
          hideBackButton={true}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 60,
          }}
          onPress={() => {
            RecordScreen.stopRecording();
            navigation.navigate('ServePracticeHomeScreen');
          }}>
          <AutoHeightImage
            source={servePracticeImage}
            width={SCREEN_WIDTH * 0.9}
          />
          <Text style={[globalStyles.h1, styles.practice_text]}>
            Serve Practice
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 26,
          }}
          onPress={() => {
            RecordScreen.stopRecording();
            // navigation.navigate('BallMachinePracticeHomeScreen')
          }}>
          <AutoHeightImage
            source={practiceWithBall}
            width={SCREEN_WIDTH * 0.9}
          />
          <Text style={[globalStyles.h1, styles.practice_text]}>
            Practice with Ball Machine
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 26,
          }}
          onPress={() => {
            RecordScreen.stopRecording();
            // navigation.navigate('HomePracticeHomeScreen')
          }}>
          <AutoHeightImage source={practiceAtHome} width={SCREEN_WIDTH * 0.9} />
          <Text style={[globalStyles.h1, styles.practice_text]}>
            Practice at Home/ Posture Workout
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default HomeScreen;
