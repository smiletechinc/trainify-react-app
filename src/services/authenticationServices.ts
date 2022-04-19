import app  from './../config/db';
import * as firebase from "firebase/auth"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, push, get, set } from "firebase/database";
import {UserObject, ErrorObject, AuthObject} from '../../types';

export const signInService = (authObject:AuthObject, onSuccess?:any,onFailure?:any) => {
    const {email, password} = authObject;
    console.log(app);
    if (app) {
    const auth = firebase.getAuth();
    firebase.signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('User: ', JSON.stringify(userCredential));
    onSuccess(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    onFailure(error);
  });
    } else {
        const error:ErrorObject = {
            message: 'Something went wrong while executing your request'
        }
        onFailure(error);
    }
}

export const signUpService = (authObject:AuthObject, onSuccess?:any,onFailure?:any) => {
    const {email, password} = authObject;
    if (app) {
    const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
     console.log('User: ', JSON.stringify(userCredential));
    onSuccess(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    onFailure(error);
  });
    } else {
        const error:ErrorObject = {
            message: 'Something went wrong while executing your request'
        }
        onFailure(error);
    }
}

export const resetPasswordService = (email:string, onSuccess?:any, onFailure?:any) => {
    console.log('Sending...')
    if (app) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
    .then((user) => {
    // Signed in
    onSuccess(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    onFailure(error);
  });
    } else {
        const error:ErrorObject = {
            message: 'Something went wrong while executing your request'
        }
        onFailure(error);
    }
}

export const registerUserService = (userObject:UserObject, onSuccess?:any, onFailure?:any) => {
  console.log("userObject", userObject);  
  const branch = `/users/${userObject.id}`
    console.log('Branch: ', branch)
    if (app) {
      const db = getDatabase(app);
        set(ref(db, branch), userObject)
        .then((user) => {
        // Signed in
        console.log(user);
        onSuccess(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        onFailure(error);
      });
        } else {
            const error:ErrorObject = {
                message: 'Something went wrong while executing your request'
            }
            onFailure(error);
        }
}

export const getUserWithIdService = (id: any, onSuccess?:any, onFailure?:any) => {
  const branch = `/users/${id}`
  console.log('Branch: ', branch)
  if (app) {
    const db = getDatabase(app);
    get(ref(db, branch)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log('snapshot', snapshot);
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