import {useCallback, useState} from 'react';
import app from './../config/db';
import {getDatabase, ref, push} from 'firebase/database';
import {ErrorObject} from '../../types';

interface Props {
  videoMetaData: any;
}

export const useAnalysisUpload = props => {
  const {videoMetaData} = props;
  const [currentAnalysisStatus, setCurrentStatus] = useState('Preparing');
  const [uploadingAnalysis, setUploadingAnalysis] = useState(false);
  const [videoAnalysisData, setVideoAnalysisData] = useState('');
  const [addVideoAnalysisFailure, setAddVideoAnalysisFailure] = useState(false);
  const [addVideoAnalysisSuccess, setAddVideoAnalysisSuccess] = useState(false);

  const addVideoAnalysisToFirebase = useCallback(
    async (video, feature?: string) => {
      let type = feature ? feature : 'video';
      console.log('Video for saved in: ', feature);
      const branch = `videos/${type}`;
      setUploadingAnalysis(true);
      setCurrentStatus('Uploading analysis');
      // console.log('Branch: ', branch)
      if (app) {
        const db = getDatabase(app);
        push(ref(db, branch), video)
          .then(response => {
            // Todo: Change video video data with id from server.
            setUploadingAnalysis(false);
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
            setUploadingAnalysis(false);
          });
      } else {
        const error: ErrorObject = {
          message: 'Something went wrong while executing your request',
        };
        setAddVideoAnalysisFailure(false);
      }
    },
    [],
  );

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
