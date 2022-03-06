import {useEffect, useState, FunctionComponent, useCallback} from 'react';
import app from './../config/db';
import firebase from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  UploadTask,
  getDownloadURL,
} from 'firebase/storage';

import {ErrorObject, VideoData} from '../../types';
import {Alert, Platform} from 'react-native';

// Create a root reference
const storage = getStorage();
storage.maxOperationRetryTime = 15000;

interface Props {
  image: any;
}

export const useThumbnailUpload = props => {
  const {image} = props;
  const [currentStatus, setCurrentStatus] = useState('Preparing');
  const [uploading, setUploading] = useState(false);
  const [uploadThumbnailFailure, setUploadThumbnailFailure] = useState(false);
  const [uploadThumbnailSuccess, setUploadThumbnailSuccess] = useState(false);
  const [thumbnailURL, setThumbnailURL] = useState('');

  useEffect(() => {
    (() => {
      console.log('File is being set');
      setThumbnailURL('');
      (() => {
        uploadThumbnail(image);
      })();
    })();
  }, [image]);

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

    const storageRef = ref(storage, `images/${fileName}`);
    const fileImage = JSON.parse(
      JSON.stringify({uri: fileURI, type: fileType, name: fileName}),
    );

    const img = await fetch(fileImage.uri);
    const bytes = await img.blob();
    console.log('ready file: ', fileImage);

    uploadBytes(storageRef, bytes)
      .then(response => {
        console.log('Thumbnail uploaded: ', response);
        // onSuccess(response);
        // let fileName = response.metadata.name
        let filePath = response.ref._location.path_;
        (() => {
          getThumbnailURL(filePath);
        })();
      })
      .catch(error => {
        console.error(error);
        setUploadThumbnailFailure(true);
        setUploading(false);
        setUploadThumbnailFailure(true);
      });
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
        setUploadThumbnailFailure(true);
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
    cancelUploading,
    uploadThumbnailSuccess,
    uploadThumbnailFailure,
  };
};
