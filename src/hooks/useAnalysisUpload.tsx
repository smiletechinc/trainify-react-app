import {useCallback, useEffect, useState} from 'react';
import app from './../config/db';
import * as firebase from 'firebase/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {getDatabase, ref, set, get, push} from 'firebase/database';
import {ErrorObject, VideoData} from '../../types';
import {getStorage, uploadBytes} from 'firebase/storage';

interface Props {
  videoData: any;
}

export const useAnalysisUpload = props => {
  const {videoData} = props;
  const [currentAnalysisStatus, setCurrentStatus] = useState('Preparing');
  const [uploadingAnalysis, setUploadingAnalysis] = useState(false);
  const [videoAnalysisData, setVideoAnalysisData] = useState('');
  const [addVideoAnalysisFailure, setAddVideoAnalysisFailure] = useState(false);
  const [addVideoAnalysisSuccess, setAddVideoAnalysisSuccess] = useState(false);

  useEffect(() => {
    (() => {
      (() => {
        if (videoData) {
          addVideoAnalysisToFirebase(videoData);
        }
      })();
    })();
  }, [videoData]);

  const addVideoAnalysisToFirebase = useCallback(async video => {
    const branch = `videos`;
    // console.log('Branch: ', branch)
    if (app) {
      const db = getDatabase(app);
      push(ref(db, branch), video)
        .then(response => {
          // Todo: Change video video data with id from server.

          console.log(
            'Response from firebase, success: ',
            JSON.stringify(response),
          );
          // Signed in
          setVideoAnalysisData(video);
          setAddVideoAnalysisSuccess(true);
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('Response from firebase, error: ', error.message);
          setAddVideoAnalysisFailure(false);
        });
    } else {
      const error: ErrorObject = {
        message: 'Something went wrong while executing your request',
      };
      setAddVideoAnalysisFailure(false);
    }
  }, []);

  const cancelUploadAnalysis = () => {
    setUploadingAnalysis(false);
  };

  return {
    uploadingAnalysis,
    videoAnalysisData,
    currentAnalysisStatus,
    addVideoAnalysisToFirebase,
    addVideoAnalysisFailure,
    addVideoAnalysisSuccess,
  };
};
