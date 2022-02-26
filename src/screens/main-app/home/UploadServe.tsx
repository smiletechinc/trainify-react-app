import React, { FunctionComponent, useEffect, useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AutoHeightImage from 'react-native-auto-height-image';

import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../../constants';
import HeaderWithText from '../../../global-components/header/HeaderWithText';
// import VideoRecorder from 'react-native-beautiful-video-recorder';

import styles from '../styles';
import globalStyles from '../../../global-styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleButton } from '../../../global-components/button';

const uploadIcon = require('../../../assets/images/upload-icon.png');


const UploadPracticeContainer: FunctionComponent = ({ navigation, route }) => {
  const {title} = route.params
  // const navigation = useNavigation();
  useEffect(() => {
  });
  // const start = () => {
  //   // 30 seconds
  //   setShowVideoRecorder(true);
  //   videoRecorder.open({ maxLength: 5 },(data) => {
  //     console.log('captured data', data);
  //   });
  // }
  
    return(
      <SafeAreaView style={styles.main_view}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.upload_serve_scroll_view}
          showsVerticalScrollIndicator={false}
        >
          <HeaderWithText
            text = {title}
            hideProfileSection = {true}
            navigation={navigation}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={styles.upload_icon_view}
            >
              <Image 
                source={uploadIcon}
                style={styles.upload_icon}
              />
            </View>
          </View>
          <SimpleButton
            buttonText="Upload Video"
            buttonType={"AUTHENTICATION"}
            onPress={()=>{
              //
            }}
            buttonStyles={{
              
            }}
          />
        </KeyboardAwareScrollView>
        
      </SafeAreaView>
    )

};
export default UploadPracticeContainer;
