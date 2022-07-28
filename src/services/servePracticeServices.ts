import app from './../config/db';
import * as firebase from 'firebase/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  query,
  equalTo,
  limitToLast,
  orderByChild,
} from 'firebase/database';
import {ErrorObject, VideoData} from '../../types';
import {getStorage, uploadBytes} from 'firebase/storage';

export const addVideoService = (
  video: any,
  onSuccess?: any,
  onFailure?: any,
  feature?: string,
) => {
  let type = feature ? feature : 'servePracticeVideos';
  const branch = `videos/${type}`;

  console.log('Branch: ', branch);
  if (app) {
    const db = getDatabase(app);
    push(ref(db, branch), video)
      .then(response => {
        console.log(
          'Response from firebase, success: ',
          JSON.stringify(response),
        );
        onSuccess(video);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Response from firebase, error: ', error.message);
        onFailure(error);
      });
  } else {
    const error: ErrorObject = {
      message: 'Something went wrong while executing your request',
    };
    onFailure(error);
  }
};

export const fetchVideosService = (
  onSuccess?: any,
  onFailure?: any,
  feature?: string,
) => {
  let type = feature ? feature : 'servePracticeVideos';
  const branch = `videos/${type}`;
  console.log('Branch: ', branch);
  if (app) {
    const db = getDatabase(app);
    const videosRef = ref(db, branch);
    const featureQuery = query(
      ref(db, branch),
      equalTo('BALL_MACHINE_PRACTICE'),
    );

    get(ref(db, branch))
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log('Server Data for Videos Fetching', snapshot.val());
          onSuccess(snapshot.val());
        } else {
          console.log('No data available');
          const error: ErrorObject = {
            code: '404',
            message: 'No data available',
          };
          onFailure(error);
        }
      })
      .catch(error => {
        console.error(error);
        onFailure(error);
      });
  } else {
    const error: ErrorObject = {
      message: 'Something went wrong while executing your request',
    };
    onFailure(error);
  }
};
