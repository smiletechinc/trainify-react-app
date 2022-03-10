import app  from './../config/db';
import * as firebase from "firebase/auth"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set, get, push } from "firebase/database";
import { ErrorObject, VideoData} from '../../types';
import { getStorage, uploadBytes } from "firebase/storage";

export const addVideoService = (video:any, onSuccess?:any, onFailure?:any) => {

    //   const analysisData = {
    //     labels: ["Flat", "Kick", "Slice"],
    // legend: ["Grade A", "Grade B", "Grade C", "Grade D"],
    // data: [
    //   [0, 0, 0, 1],
    //   [0, 0, 0, 1],
    //   [0, 0, 0, 1],
    // ],
    // barColors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
    // };

    //   const analysisDataString = analysisData;

    // const updatedVideoData = {...video, analysisData: analysisDataString}

    // console.log('Firebase data: ', JSON.stringify(video));

    const branch = `videos`
    // console.log('Branch: ', branch)
    if (app) {
        const db = getDatabase(app);
        push(ref(db, branch), video)
        .then((response) => {

          // Todo: Change video video data with id from server.

          console.log('Response from firebase, success: ', JSON.stringify(response));
        // Signed in
        onSuccess(video);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Response from firebase, error: ', error.message);
        onFailure(error);
      });
    } else {
        const error:ErrorObject = {
          message: 'Something went wrong while executing your request'
        }
        onFailure(error);
      }
}

export const fetchVideosService = (onSuccess?:any, onFailure?:any) => {
  const branch = 'videos';
  console.log('Branch: ', branch)
  if (app) {
    const db = getDatabase(app);
    get(ref(db, branch)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        onSuccess(snapshot.val());
      } else {
        console.log("No data available");
        const error:ErrorObject = {
          code:'404',
          message: 'No data available'
        }
        onFailure(error);
      }
    }).catch((error) => {
      console.error(error);
      onFailure(error);
    });
  } else {
    const error:ErrorObject = {
    message: 'Something went wrong while executing your request'
  }
  onFailure(error);
}
}