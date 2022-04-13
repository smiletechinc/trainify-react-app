import {useState, useCallback} from 'react';
import app from '../config/db';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import firebase from 'firebase/auth';
import {ErrorObject} from '../../types';
import {Alert} from 'react-native';
import {setUserObject} from '../redux/slices/AuthSlice';

interface Props {
  authObject: any;
}

export const useAuthentication = props => {
  const {authObject} = props;
  const [authObjectId, setAuthObjectId] = useState('');
  const [uploadAuthObjectFailure, setUploadAuthObjectFailure] = useState(false);

  const signUpService = useCallback(async authObject => {
    console.log('Auth Oject: ', authObject);
    const {email, password} = authObject;
    if (app) {
      try {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            // Signed in
            const user = userCredential.user;
            console.log('User: ', JSON.stringify(userCredential));
            setAuthObjectId(user.uid);
          })
          .catch(error => {
            setUploadAuthObjectFailure(true);
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/email-already-in-use') {
              Alert.alert('Signup error', 'User already exists!');
            } else {
              console.log('signup error: ', errorMessage);
              Alert.alert(
                'Signup error',
                'Please enter a valid email and password',
              );
            }
          });
      } catch (error) {
        Alert.alert('Auth Object not uploaded.', error);
        Alert.alert('Error Signup AuthObject, ', JSON.stringify(error));
      }
    } else {
      const error: ErrorObject = {
        message: 'Something went wrong while executing your request',
      };
      console.log('signup error: ', 'Unknown');
      Alert.alert('Signup error', 'Error in signup!');
    }
  }, []);

  const signInService = useCallback(async authObject => {
    console.log('Auth Oject: ', authObject);
    const {email, password} = authObject;
    console.log(app);
    if (app) {
      try {
        const auth = firebase.getAuth();
        firebase
          .signInWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            // Signed in
            const user = userCredential.user;
            console.log('User: ', JSON.stringify(userCredential));
            // onSuccess(user);
          })
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // onFailure(error);
          });
      } catch (error) {
        Alert.alert('Auth Object not fetched.', error);
        Alert.alert('Error SignIn AuthObject, ', JSON.stringify(error));
      }
    } else {
      const error: ErrorObject = {
        message: 'Something went wrong while executing your request',
      };
      // onFailure(error);
    }
  }, []);

  return {
    signUpService,
    signInService,
    authObjectId,
    uploadAuthObjectFailure,
  };
};
