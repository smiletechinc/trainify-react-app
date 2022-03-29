import { useEffect, useState, FunctionComponent, useCallback } from 'react';
import app from '../config/db';
import firebase from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  UploadTask,
  getDownloadURL,
} from 'firebase/storage';
import storage1 from '@react-native-firebase/storage';

import { ErrorObject, VideoData } from '../../types';
import { Alert, Platform } from 'react-native';

// Create a root reference
const storage = getStorage();
storage.maxOperationRetryTime = 15000;

interface Props {
  videoData: any;
}

export const useMediaUpload = props => {
  const { videoData } = props;
  const [currentStatus, setCurrentStatus] = useState('Preparing');
  const [uploading, setUploading] = useState(false);
  const [uploadThumbnailFailure, setUploadThumbnailFailure] = useState(false);
  const [uploadThumbnailSuccess, setUploadThumbnailSuccess] = useState(false);
  const [thumbnailURL, setThumbnailURL] = useState('');
  const [thumbnailData, setThumbnailData] = useState(null);

  const [uploadVideoFailure, setUploadVideoFailure] = useState(false);
  const [uploadVideoSuccess, setUploadVideoSuccess] = useState(false);
  const [videoURL, setVideoURL] = useState('');

  // useEffect(() => {
  //   (() => {
  //     //   Alert.alert('File is being set');
  //     setThumbnailURL('');
  //     (() => {
  //       if (thumbnailData) {
  //         uploadThumbnail(thumbnailData);
  //       }
  //     })();
  //   })();
  // }, [thumbnailData]);

  // useEffect(() => {
  //   (() => {
  //     //   Alert.alert('File is being set');
  //     setVideoURL('');
  //     (() => {
  //       if (videoData && videoData.uri) {
  //         uploadVideo(videoData);
  //       }
  //     })();
  //   })();
  // }, [videoData]);

  const uploadThumbnail = useCallback(async imageData => {
    setUploading(true);
    setCurrentStatus('Uploading thumbnail');

    const fileName = imageData.fileName
      ? imageData.fileName
      : imageData.name
        ? imageData.name
        : 'temp-file-name';
    const fileURI = imageData.uri;
    const fileType = imageData.type;

    const videoReference = storage1().ref(`images/${fileName}`);

    const fileImage = JSON.parse(
      JSON.stringify({ uri: fileURI, type: fileType, name: fileName }),
    );

    try {
      const task = videoReference.putFile(fileImage.uri);

      task.then((response) => {
        console.log('Thumbnail uploaded: ', response);
        let filePath = response.metadata.fullPath;
        (() => {
          getThumbnailURL(filePath);
        })();

      }).catch((error) => {
        console.error(error);
        setUploadThumbnailFailure(true);
        setUploading(false);
        setUploadThumbnailFailure(true);
      });
    } catch (error) {
      Alert.alert('Error uploading humbnail', JSON.stringify(error));
      setUploading(false);
      setCurrentStatus('Error uploading thumbnail');
    }
  }, []);

  const getThumbnailURL = (fileName: string) => {
    console.log('fetching url for thumbnail: ', fileName);
    const storageRef = ref(storage, fileName);
    getDownloadURL(storageRef)
      .then(response => {
        console.log('Thumbnail url response success: ', response);
        setThumbnailURL(response);
        setUploading(false);
      })
      .catch(error => {
        console.log('Thumbnail url response error: ', error);
        console.error(error);
        setUploadThumbnailFailure(true);
        setUploading(false);
      });
    // return downloadURL;
  };

  const uploadVideo = useCallback(async videoData => {
    setUploading(true);
    setCurrentStatus('Uploading video');
    console.log('uploading video: ', videoData);

    const fileName = videoData.fileName
      ? videoData.fileName
      : videoData.name
        ? videoData.name
        : 'temp-file-name';
    const fileURI = videoData.uri;

    const videoReference = storage1().ref(`videos/${fileName}`);
    try {
      const task = videoReference.putFile(fileURI);
      task.on('state_changed', taskSnapshot => {
        const percentage = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
        setCurrentStatus(`uploading video ${percentage}%`);
      });
      task.then((response) => {
        console.log('File uploaded successfully:.... ', response);
        let filePath = response.metadata.fullPath;
        (() => {
          getVideoURL(filePath);
        })();
      }).catch((error) => {
        Alert.alert('Error:.... ', error);
        console.error(error);
        setUploadVideoFailure(true);
        setUploading(false);
        // onFailure(error);
      });
    } catch (error) {
      Alert.alert('Sorry Something went wrong.', error);
      Alert.alert('Error uploading video, ');
      setUploading(false);
      setCurrentStatus('Error uploading video');
    }
  }, []);

  const getVideoURL = (fileName: string) => {
    console.log('fetching url for thumbnail: ', fileName);
    const storageRef = ref(storage, fileName);
    getDownloadURL(storageRef)
      .then(response => {
        console.log('Video url response success: ', response);
        setVideoURL(response);
        setUploading(false);
      })
      .catch(error => {
        console.log('Video url response error: ', error);
        console.error(error);
        setUploadVideoFailure(true);
        setUploading(false);
      });
    // return downloadURL;
  };

  const cancelUploading = () => {
    setUploading(false);
    console.log('Uploading cancelled');
  };

  return {
    uploading,
    currentStatus,
    uploadThumbnail,
    uploadVideo,
    cancelUploading,
    thumbnailURL,
    uploadThumbnailSuccess,
    uploadThumbnailFailure,
    videoURL,
    uploadVideoSuccess,
    uploadVideoFailure,
  };
};
