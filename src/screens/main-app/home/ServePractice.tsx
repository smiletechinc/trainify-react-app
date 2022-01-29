import React, { FunctionComponent, useEffect } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AutoHeightImage from 'react-native-auto-height-image';

import {COLORS, SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../../constants';
import HeaderWithText from '../../../global-components/header/HeaderWithText';
import styles from '../styles';
import globalStyles from '../../../global-styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const recordIcon = require('../../../assets/images/record-icon.png');
const uploadIcon = require('../../../assets/images/upload-icon.png');
const analysisIcon = require('../../../assets/images/analysis-icon.png');

const ServePracticeContainer: FunctionComponent = ({ navigation }) => {
  // const navigation = useNavigation();
  useEffect(() => {
  });

  return(
    <View style={styles.home_main_view}>
       <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
       >
        <HeaderWithText
          text = "Serve Practice"
        />
        <View
          style={{flexDirection: 'row', marginTop: 60,}}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            delayPressIn={0}
            onPress={()=> {
              // navigation.navigate('ServePractice');
            }}
          >
            <AutoHeightImage source={recordIcon} width={((SCREEN_WIDTH * 0.9) / 2) - 23} />
            <Text style={[globalStyles.medium, styles.record_and_upload_text]}>Record Right-Handed Serve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            delayPressIn={0}
            style={{
              marginLeft: 23,
            }}
            onPress={()=> {
              // navigation.navigate('ServePractice');
            }}
          >
            <AutoHeightImage source={recordIcon} width={((SCREEN_WIDTH * 0.9) / 2) - 23} />
            <Text style={[globalStyles.medium, styles.record_and_upload_text]}>Record Left-Handed Serve</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{flexDirection: 'row', marginTop: 28,}}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            delayPressIn={0}
            onPress={()=> {
              // navigation.navigate('ServePractice');
            }}
          >
            <AutoHeightImage source={uploadIcon} width={((SCREEN_WIDTH * 0.9) / 2) - 23} />
            <Text style={[globalStyles.medium, styles.record_and_upload_text]}>Upload Right-Handed Serve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            delayPressIn={0}
            style={{
              marginLeft: 23,
            }}
            onPress={()=> {
              // navigation.navigate('ServePractice');
            }}
          >
            <AutoHeightImage source={uploadIcon} width={((SCREEN_WIDTH * 0.9) / 2) - 23} />
            <Text style={[globalStyles.medium, styles.record_and_upload_text]}>Upload Left-Handed Serve</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{flexDirection: 'row', marginTop: 18,}}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            delayPressIn={0}
            onPress={()=> {
              // navigation.navigate('ServePractice');
            }}
          >
            <AutoHeightImage source={analysisIcon} width={((SCREEN_WIDTH * 0.9) / 2) - 23} />
            <Text style={[globalStyles.medium, styles.record_and_upload_text]}>Analysis Reports</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
};
export default ServePracticeContainer;
