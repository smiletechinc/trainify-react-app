import React, {FunctionComponent, useEffect} from 'react';
import AutoHeightImage from 'react-native-auto-height-image';
import {SCREEN_WIDTH} from '../../../constants';
import Header from '../../../global-components/header';
import styles from '../styles';
import globalStyles from '../../../global-styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import HeaderWithText from '../../../global-components/header/HeaderWithText';
import RecordScreen from 'react-native-record-screen';
import CameraRoll from '@react-native-community/cameraroll';

const servePracticeImage = require('../../../assets/images/serve_icon.png');
const practiceWithBall = require('../../../assets/images/ballMachine_icon.png');

type Props = {
  navigation: any;
};

const HomeScreen: FunctionComponent<Props> = ({navigation}) => {
  useEffect(() => {
    RecordScreen.startRecording({mic: false});
    console.log('screenWidth:', SCREEN_WIDTH);
  }, []);

  return (
    <View style={styles.home_main_view}>
      <KeyboardAwareScrollView>
        <View style={styles.navigationBar}>
          <HeaderWithText
            text={''}
            navigation={navigation}
            hideBackButton={true}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 100,
          }}
          onPress={() => {
            RecordScreen.stopRecording();
            navigation.navigate('ServePracticeHomeScreen');
          }}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 30,
              backgroundColor: '#F2994A',
              borderColor: '#F2994A',
              display: 'flex',
              flex: 1,
              paddingBottom: 16,
            }}>
            <View style={{marginLeft: 10}}>
              <Image source={servePracticeImage} style={{margin: 12}} />
              <Text style={styles.practice_text}>Serve Practice</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          delayPressIn={0}
          style={{
            marginTop: 50,
          }}
          onPress={() => {
            RecordScreen.stopRecording();
            navigation.navigate('BallMachinePracticeHomeScreen');
          }}>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 30,
              backgroundColor: '#2D9CDB',
              borderColor: '#2D9CDB',
              display: 'flex',
              flex: 1,
              paddingBottom: 8,
            }}>
            <View style={{marginLeft: 10}}>
              <Image source={practiceWithBall} style={{margin: 12}} />
              <Text style={styles.practice_text}>
                Practice Volley / Ball Machine
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default HomeScreen;
