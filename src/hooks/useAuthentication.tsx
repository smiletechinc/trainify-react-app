import {useState, useCallback, useEffect} from 'react';
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
  const [registeredUserObject, setRegisteredUserObject] =
    useState<firebase.User>();
  const [registerUserStatus, setRegisterUserStatus] =
    useState('Setting up account');
  const [registerErrorStatus, setErrorStatus] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);

  const signUpService = useCallback(async authObject => {
    setCreatingAccount(true);
    setRegisterUserStatus('Creating account !');
    setErrorStatus('');
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
            if (user) {
              setRegisterUserStatus('Account created successfully!');
              setRegisteredUserObject(user);
            }
            setCreatingAccount(false);
            // setErrorRegisterObject('');
          })
          .catch(error => {
            // setErrorRegisterObject(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/email-already-in-use') {
              // console.log('User already exists!');
              setErrorStatus('User already exists!');
            } else {
              console.log('signup error: ', errorMessage);
              setErrorStatus('Invalid email or password');
            }
            setCreatingAccount(false);
            // setRegisteredUserObject('');
          });
      } catch (error) {
        Alert.alert('Auth Object not uploaded.', error);
        Alert.alert('Error Signup AuthObject, ', JSON.stringify(error));
        setCreatingAccount(false);
        setErrorStatus('Error Creating account');
      }
    } else {
      const error: ErrorObject = {
        message: 'Something went wrong while executing your request',
      };
      console.log('signup error: ', 'Unknown');
      Alert.alert('Signup error', 'Error in signup!');
      setCreatingAccount(false);
      setErrorStatus('Error in server');
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

  const cancelUploading = () => {
    setCreatingAccount(false);
    console.log('Uploading cancelled');
  };

  return {
    registeredUserObject,
    creatingAccount,
    registerUserStatus,
    registerErrorStatus,
    signUpService,
    signInService,
    cancelUploading,
  };
};
