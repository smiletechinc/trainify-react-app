import app from './../config/db';
import firebase from "firebase/auth";
import { getStorage, ref, uploadString, uploadBytes, UploadTask, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import storage from '@react-native-firebase/storage';
import { ErrorObject, VideoData } from '../../types';
import { Alert, Platform } from 'react-native';

export const uploadVideoService = async (videoData, onSuccess?: any, onFailure?: any) => {
  const fileName = videoData.fileName ? videoData.fileName : videoData.name ? videoData.name : 'temp-file-name';
  const fileURI = videoData.uri;
  const fileType = videoData.type;
  const fileImage = JSON.parse(JSON.stringify({ uri: fileURI, type: fileType, name: fileName }));
  const videoReference = storage().ref(`videos/${fileName}`);

  try {
    const task = videoReference.putFile(fileURI);
    task.then(() => {
      console.log('File uploaded successfully.')
    }).catch((error) => {
      Alert.alert('Error:.... ', error);
      onFailure(error);
    });
  } catch (error) {
    Alert.alert('Sorry Something went wrong.', error);
  }

}

export const uploadPhotoService = async (imageData, onSuccess?: any, onFailure?: any) => {

  console.log('Image: ', imageData);

  const fileName = imageData.fileName ? imageData.fileName : imageData.name ? imageData.name : 'temp-file-name';
  const fileURI = imageData.uri;
  const fileType = imageData.type;

  const storageRef = ref(storage, `images/${fileName}`);

  const fileImage = JSON.parse(JSON.stringify({ uri: fileURI, type: fileType, name: fileName }));

  const img = await fetch(fileImage.uri);
  const bytes = await img.blob();
  console.log('ready file: ', fileImage);

  try {
    uploadBytes(storageRef, bytes)
      .then((response) => {
        console.log('Thumbnail uploaded: ', response);
        // onSuccess(response);
        // let fileName = response.metadata.name
        let filePath = response.ref._location.path_;

        getThumbnailURL(filePath, onSuccess, onFailure);
      })
      .catch((error) => {
        console.error(error);
        onFailure(error);
      })
  } catch (error) {
    Alert.alert(error);
  }

}

export const getThumbnailURL = (fileName: string, onSuccess?: any, onFailure?: any) => {
  console.log('fetching url for thumbnail: ', fileName);
  const storageRef = ref(storage, fileName);
  getDownloadURL(storageRef)
    .then((response) => {
      console.log('Thumbnail url response success: ', response);
      onSuccess(response);
    })
    .catch((error) => {
      console.log('Thumbnail url response error: ', error);

      console.error(error);
      onFailure(error);
    })
  // return downloadURL;
}

export const getVideoURL = (fileName: string, onSuccess?: any, onFailure?: any) => {
  console.log('fetching url for video: ', fileName);
  const storageRef = ref(storage, fileName);
  getDownloadURL(storageRef)
    .then((response) => {
      console.log('Thumbnail url response success: ', response);
      onSuccess(response);
    })
    .catch((error) => {
      console.log('Thumbnail url response error: ', error);

      console.error(error);
      onFailure(error);
    })
  // return downloadURL;
}

export const downloadVideoService = () => {

}