import app  from './../config/db';
import firebase from "firebase/auth";
import { getStorage, ref, uploadString, uploadBytes, UploadTask } from "firebase/storage";

import { ErrorObject, VideoData} from '../../types';
import { Platform } from 'react-native';

// Create a root reference
const storage = getStorage();

export const uploadVideoService = async (video, onSuccess?:any, onFailure?:any) => {

  console.log('Video: ', video);
  // const uri:string = video.uri;

  // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

  // Create a reference to 'images/mountains.jpg'
  const fileName = video.assets[0].fileName;
  const fileURI = video.assets[0].uri;
  const fileType = video.assets[0].type;

  const storageRef = ref(storage, `videos/${fileName}`);

  // const uploadTask = storage.ref(`/images/${video.fileName}`).put(video.fileName)


// 'file' comes from the Uri

// var storageRef = firebase.storage.ref("folderName/file.jpg");

// const fileImage = {
//   uri: fileURI,
//   name: fileName,
//   type: fileType, // if you can get image type from cropping replace here
// }

// const fileImage = ('photo', {
//   uri: fileURI,
//   type: fileType, 
//   name: fileName,
// })

const fileImage = JSON.parse(JSON.stringify({ uri: fileURI, type: fileType, name: fileName }));

const img = await fetch(fileImage.uri);
const bytes = await img.blob();
console.log('ready file: ', fileImage);

uploadBytes(storageRef, bytes)
.then((response) => {
  // console.log('Video uploaded: ', response);
  onSuccess(response);
})
.then((error) => {
  console.error(error);
  onFailure(error);
})


// console.log('storageRef: ', storageRef);
// uploadString(storageRef, video)
// .then((snapshot) => {
//   console.log('Video uploaded');
// })
// .catch((error) => {
//   console.error(error);
//   onFailure(error);
// });

}

export const downloadVideoService = () => {
    
}