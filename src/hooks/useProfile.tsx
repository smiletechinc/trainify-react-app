import {useState, useCallback} from 'react';
// import app from './../config/db';

// import firebase from 'firebase/auth';
import {Alert} from 'react-native';
import {setUserObject} from '../redux/slices/AuthSlice';

import firebase from '@react-native-firebase/app';
import storage1 from '@react-native-firebase/storage';

// Create a root reference

interface Props {
  userObject?: any;
}

/**
 * Custom hook for managing profile.
 */

export const useProfile = () => {
  const [userObjectId, setuserObjectId] = useState('');
  const [profileUser, setProfileUser] = useState();
  const [profileUserStatus, setProfileUserStatus] =
    useState('Setting up profile');
  const [profileErrorStatus, setProfileErrorStatus] = useState('');
  const [creatingProfile, setCreatingProfile] = useState(false);

  const registerProfileService = useCallback(async userObject => {
    console.log('user Oject: ', userObject);
    const branch = `/users/${userObject.id}`;
    console.log('Branch: ', branch);
    setCreatingProfile(true);
    setProfileUserStatus('Creating profile');

    try {
      // const db = getDatabase(app);
      // console.log('Database', db);
      // push(ref(db, branch), userObject)
      //   .then(user => {
      //     // Signed in
      //     setProfileUser(user);
      //     console.log('User: ', user);
      //   })
      //   .catch(error => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     Alert.alert('Trainify', errorMessage);
      //   });
    } catch (error) {
      Alert.alert('Trainify', 'Error in user registration!');
      setProfileErrorStatus('Error Creating Profile');
      setCreatingProfile(false);
    }
  }, []);

  return {
    profileUser,
    creatingProfile,
    profileErrorStatus,
    profileUserStatus,
    registerProfileService,
  };
};
