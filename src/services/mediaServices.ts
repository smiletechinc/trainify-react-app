import app from './../config/db';
import firebase from "firebase/auth";
import { getStorage, ref, uploadString, uploadBytes, UploadTask, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { ErrorObject, VideoData } from '../../types';
import { Alert, Platform } from 'react-native';

// Create a root reference
const storage = getStorage();
storage.maxOperationRetryTime = 15000;

export const uploadVideoService = async (videoData, onSuccess?: any, onFailure?: any) => {

  console.log('Video: ', videoData);
  // const uri:string = video.uri;

  // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

  // Create a reference to 'images/mountains.jpg'
  const fileName = videoData.fileName ? videoData.fileName : videoData.name ? videoData.name : 'temp-file-name';

  const fileURI = videoData.uri;
  const fileType = videoData.type;

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

  try {
    const fileImage = JSON.parse(JSON.stringify({ uri: fileURI, type: fileType, name: fileName }));
    Alert.alert('upload 11111: ', JSON.stringify(fileImage));
    // const uploadUri = Platform.OS === 'ios' ? fileImage.uri.replace('file://', '') : fileImage.uri

    const file = await fetch(fileImage.uri);
    // const file = fileImage.uri;
    Alert.alert('upload  22222:  ', JSON.stringify(file));
    try{
      const bytes = await file.blob();
      Alert.alert('upload 33333: ', JSON.stringify(bytes));
      const metadata = { contentType: "video/mp4" };

      uploadBytes(storageRef, bytes, metadata)
        .then((response) => {
          Alert.alert('Video uploaded: ', JSON.stringify(response));
          // let fileName = response.metadata.name
          console.log('success: ', response);
          let filePath = response.ref._location.path_;
          if (filePath){
            Alert.alert('video path: ', filePath);
          } else{
            Alert.alert("VideoPath is not found");
          }
          // getVideoURL(filePath, onSuccess, onFailure);
          // file.blob.prototype.stop();
        })
        .catch((error) => {
          Alert.alert('Error in uploading: ', error);
          onFailure(error);
          file.blob.prototype.stop();
        })
    } catch (error) {
      Alert.alert('Error in internal catch ', JSON.stringify(error));
    onFailure(error);
    file.blob.prototype.stop();
    }
  } catch (error){
    Alert.alert('Error in catch ', JSON.stringify(error));
    onFailure(error);
  }


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

export const uploadPhotoService = async (imageData, onSuccess?: any, onFailure?: any) => {

  console.log('Image: ', imageData);
  // const uri:string = video.uri;

  // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

  // Create a reference to 'images/mountains.jpg'
  const fileName = imageData.fileName ? imageData.fileName : imageData.name ? imageData.name : 'temp-file-name';
  const fileURI = imageData.uri;
  const fileType = imageData.type;

  const storageRef = ref(storage, `images/${fileName}`);

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
  Alert.alert('fetching url for video: ', fileName);
  const storageRef = ref(storage, fileName);
  getDownloadURL(storageRef)
    .then((response) => {
      Alert.alert('Thumbnail url response success: ', response);
      onSuccess(response);
    })
    .catch((error) => {
      Alert.alert('Thumbnail url response error: ', error);

      console.error(error);
      onFailure(error);
    })
  // return downloadURL;
}

export const downloadVideoService = () => {

}

export const uploadVideoServiceBackup2 = async (videoData, onSuccess?: any, onFailure?: any) => {

  const fileName = videoData.fileName ? videoData.fileName : videoData.name ? videoData.name : 'temp-file-name';
  const fileURI = videoData.uri;
  const fileType = videoData.type;

// export const uploadVideoAsync =  async (uri) => {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", fileURI, true);
    xhr.send(null);
  });

  const storageRef = ref(storage, `videos/${fileName}`);
  // const ref = firebase.storage().ref().child(uuid.v4());
  if (blob){
    Alert.alert('Uploading bytes...');
    const snapshot = await uploadBytes(storageRef, blob);
    // const uploadedVideo = await snapshot.ref.getDownloadURL();
    if(snapshot){
      Alert.alert('video uploaded successfuly, ', JSON.stringify(snapshot));
    }
    // We're done with the blob, close and release it
    blob.close();
    return snapshot;
  } else {
    Alert.alert('Empty blob');
  }
}

export const uploadVideoServiceBackup3 = async (videoData, onSuccess?: any, onFailure?: any) => {

  const fileName = videoData.fileName ? videoData.fileName : videoData.name ? videoData.name : 'temp-file-name';
  const fileURI = videoData.uri;
  const fileType = videoData.type;


  // const videoRef = firebase.storage().ref("video/filename");
  const videoRef = ref(storage, `videos/${fileName}`);

  const metadata = { contentType: "video/mp4" };

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.ontimeout = function (e) {
      // XMLHttpRequest timed out. Do something here.

      console.log(e);
    };
    xhr.onerror = function (e) {
      console.log(e);

      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", fileURI, true);
    xhr.timeout = 1000 * 60;
    xhr.send(null);
  });


  var uploadTask = videoRef.put(blob, metadata);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = snapshot.bytesTransferred / snapshot.totalBytes;

    

      // switch (snapshot.state) {
      //   case storage.TaskState.PAUSED: // or 'paused'
      //     console.log("Upload is paused");
      //     break;
      //   case firebase.storage.TaskState.RUNNING: // or 'running'
      //     console.log("Upload is running");
      //     break;
      // }
    },
    (error) => {
      console.log(error);

      // Handle unsuccessful uploads
      blob.close();
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {


Alert.alert("Video file save at:",downloadURL)
       
      });
      blob.close();
    }
  );
}