import app from './../config/db';
import firebase from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  UploadTask,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';

import storage from '@react-native-firebase/storage';
import {ErrorObject, VideoData} from '../../types';
import {Alert, Platform} from 'react-native';

export const uploadVideoService = async (
  videoData,
  onSuccess?: any,
  onFailure?: any,
) => {
  const fileName = videoData.fileName
    ? videoData.fileName
    : videoData.name
    ? videoData.name
    : 'temp-file-name';
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

  const fileImage = JSON.parse(
    JSON.stringify({uri: fileURI, type: fileType, name: fileName}),
  );
  console.log('StorageRef', storageRef);

  const img = await fetch(fileImage.uri);
  console.log('img in uploadservices:', img);
  const bytes = await img.blob();
  console.log('ready file: ', fileImage);

  if (bytes) {
    uploadBytes(storageRef, bytes)
      .then(response => {
        console.log('Video uploaded: ', response);
        // let fileName = response.metadata.name
        let filePath = response.ref._location.path_;
        console.log('FilePath of BYtes:', filePath);
        getVideoURL(filePath, onSuccess, onFailure);
      })
      .catch(error => {
        console.error(error);
        onFailure(error);
      });
  } else {
    console.log('bytes are empty');
    onFailure('bytes are empty');
  }
  // uploadBytes(storageRef, bytes)
  // .then((response) => {
  //   console.log('Video uploaded: ', response);
  //   // let fileName = response.metadata.name
  //   let filePath = response.ref._location.path_;
  //   getVideoURL(filePath, onSuccess, onFailure);})
  // .catch((error) => {
  //   console.error(error);
  //   onFailure(error);
  // })

  // console.log('storageRef: ', storageRef);
  // uploadString(storageRef, video)
  // .then((snapshot) => {
  //   console.log('Video uploaded');
  // })
  // .catch((error) => {
  //   console.error(error);
  //   onFailure(error);
  // });
};

export const uploadPhotoService = async (
  imageData,
  onSuccess?: any,
  onFailure?: any,
) => {
  console.log('Image: ', imageData);

  const fileName = imageData.fileName
    ? imageData.fileName
    : imageData.name
    ? imageData.name
    : 'temp-file-name';
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

  const fileImage = JSON.parse(
    JSON.stringify({uri: fileURI, type: fileType, name: fileName}),
  );

  const img = await fetch(fileImage.uri);
  const bytes = await img.blob();
  console.log('ready file: ', fileImage);

  if (bytes) {
    uploadBytes(storageRef, bytes)
      .then(response => {
        console.log('Video uploaded: ', response);
        // let fileName = response.metadata.name
        let filePath = response.ref._location.path_;
        console.log('FilePath of BYtes:', filePath);
        getVideoURL(filePath, onSuccess, onFailure);
      })
      .catch(error => {
        console.error(error);
        onFailure(error);
      });
  } else {
    console.log('bytes are empty');
    onFailure('bytes are empty');
  }
  // uploadBytes(storageRef, bytes)
  // .then((response) => {
  //   console.log('Thumbnail uploaded: ', response);
  //   // onSuccess(response);
  //   // let fileName = response.metadata.name
  //   let filePath = response.ref._location.path_;

  //   getThumbnailURL(filePath, onSuccess, onFailure);
  // })
  // .catch((error) => {
  //   console.error(error);
  //   onFailure(error);
  // })

  // console.log('storageRef: ', storageRef);
  // uploadString(storageRef, video)
  // .then((snapshot) => {
  //   console.log('Video uploaded');
  // })
  // .catch((error) => {
  //   console.error(error);
  //   onFailure(error);
  // });
};

export const getThumbnailURL = (
  fileName: string,
  onSuccess?: any,
  onFailure?: any,
) => {
  console.log('fetching url for thumbnail: ', fileName);
  const storageRef = ref(storage, fileName);
  getDownloadURL(storageRef)
    .then(response => {
      console.log('Thumbnail url response success: ', response);
      onSuccess(response);
    })
    .catch(error => {
      console.log('Thumbnail url response error: ', error);

      console.error(error);
      onFailure(error);
    });
  // return downloadURL;
};

export const getVideoURL = (
  fileName: string,
  onSuccess?: any,
  onFailure?: any,
) => {
  console.log('fetching url for video: ', fileName);
  const storageRef = ref(storage, fileName);
  getDownloadURL(storageRef)
    .then(response => {
      console.log('Thumbnail url response success: ', response);
      onSuccess(response);
    })
    .catch(error => {
      console.log('Thumbnail url response error: ', error);

      console.error(error);
      onFailure(error);
    });
  // return downloadURL;
};

export const downloadVideoService = () => {};
