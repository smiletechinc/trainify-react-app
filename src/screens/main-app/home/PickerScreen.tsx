import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AutoHeightImage from 'react-native-auto-height-image';

import {COLORS, SCREEN_HEIGHT, SCREEN_WIDTH, STATUS_BAR_HEIGHT} from '../../../constants';
import HeaderWithText from '../../../global-components/header/HeaderWithText';
// import VideoRecorder from 'react-native-beautiful-video-recorder';

import external_styles from '../styles';
import globalStyles from '../../../global-styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../../context/auth-context';

const recordIcon = require('../../../assets/images/record-icon.png');
const uploadIcon = require('../../../assets/images/upload-service.png');
const analysisIcon = require('../../../assets/images/analysis-icon.png');


import {DemoTitle, DemoButton, DemoResponse} from './components';
import { addVideoService } from '../../../services/servePracticeServices';
import { uploadVideoService } from '../../../services/mediaServices';
import * as ImagePicker from 'react-native-image-picker';
import { add } from '@tensorflow/tfjs-core/dist/engine';

const includeExtra = true;

const PickerScreen: FunctionComponent = ({ navigation }) => {

  const { authUser, setAuthUser } = React.useContext(AuthContext);
  const {playerstyle} = authUser ? authUser : "";
  
  const [response, setResponse] = React.useState<any>(null);
    
  useEffect(() => {
    if(response && response.assets){
      
      Alert.alert('Adding');
      console.log('response: ', response);
      addVideoToFirebase();
    }
  }, [response]);
  
  const addVideoSuccess = (video?:any) => {

      console.log("Added: ", JSON.stringify(video));
      if (response){
        var analysis_data = {
          labels: ["Flat", "Kick", "Slice"],
          legend: ["A", "B", "C", "D"],
          data: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 1],
          ],
          barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
        };
        let vidData = response.assets[0];
        vidData = {...vidData, 
        analysisData: analysis_data}
        navigation.navigate('VideoPlayerContainer', {video:vidData});
      }
      if (video) {
        Alert.alert("Trainify", `Video added successfully.`);
      }
    }
  
    const addVideoFailure = (error?:any) => {
      console.log("Error: ", JSON.stringify(error));
      if (error) {
        Alert.alert("Trainify", `Error in adding video.`);
      }
    }
    
    const addVideoToFirebase = () => {
      // uploadVideoService(response, addVideoSuccess, addVideoFailure);
      var analysis_data = {
        labels: ["Flat", "Kick", "Slice"],
        legend: ["A", "B", "C", "D"],
        data: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 1],
        ],
        barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
      };
      let vidData = response.assets[0];
        vidData = {...vidData, 
        analysisData: analysis_data}

        addVideoService(vidData, addVideoSuccess, addVideoFailure);
    }

    const handleFetchVideo = (res) =>{
      if(res && res.assets && res.assets[0]){
        setResponse(response);
        console.log('response: ', response);
        addVideoToFirebase();
      }
    }
  
    // const loadVideo = (e) => {
      
    // }
  
    const onButtonPress = React.useCallback((type, options) => {
      if (type === 'capture') {
        ImagePicker.launchCamera(options, setResponse);
      } else {
        ImagePicker.launchImageLibrary(options, setResponse);
      }
    }, []);
  
    return(
      <SafeAreaView style={external_styles.main_view}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <HeaderWithText
            text = "Upload Video"
            navigation={navigation}
          />
      <ScrollView>
        <View style={styles.buttonContainer}>
          {actions.map(({title, type, options}) => {
            return (
              <DemoButton
                key={title}
                onPress={() => onButtonPress(type, options)}>
                {title}
              </DemoButton>
            );
          })}
        </View>
        <DemoResponse>{response}</DemoResponse>

        {response?.assets &&
          response?.assets.map(({uri}) => (
            <View key={uri} style={styles.image}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={{width: 200, height: 200}}
                source={{uri: uri}}
              />
            </View>
          ))}
      </ScrollView>
        </KeyboardAwareScrollView>
        
      </SafeAreaView>
    )

};
export default PickerScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },

  image: {
    marginVertical: 24,
    alignItems: 'center',
  },

  cameraTypeSwitcher: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 180,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },

});

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Image',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Select Image',
    type: 'library',
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Take Video',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: 'Select Video',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'video',
      includeExtra,
    },
  },
  {
    title: `Select Image or Video\n(mixed)`,
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'mixed',
      includeExtra,
    },
  },
];
