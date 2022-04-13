import {useState, useCallback} from 'react';
import app from '../config/db';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import firebase from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {ErrorObject} from '../../types';
import {Alert} from 'react-native';
import {setUserObject} from '../redux/slices/AuthSlice';
import {getDatabase, ref, push, get} from 'firebase/database';

// Create a root reference
const storage = getStorage();
storage.maxOperationRetryTime = 15000;

interface Props {
  userObject?: any;
}

export const useRegisterd = () => {
  const [userObjectId, setuserObjectId] = useState('');
  const registerUserService = useCallback(async userObject => {
    console.log('user Oject: ', userObject);
    const branch = `/users/${userObject.id}`;
    console.log('Branch: ', branch);
    if (app) {
      try {
        const db = getDatabase(app);
        console.log('Database', db);
        push(ref(db, branch), userObject)
          .then(user => {
            // Signed in
            console.log('User: ', user);
          })
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Alert.alert('Trainify', errorMessage);
          });
      } catch (error) {
        Alert.alert('Trainify', 'Error in user registration!');
      }
    } else {
      const error: ErrorObject = {
        message: 'Something went wrong while executing your request',
      };
      console.log('signup error: ', 'Unknown');
      Alert.alert('Signup error', 'Error in signup!');
    }
  }, []);

  return {
    registerUserService,
  };
};
