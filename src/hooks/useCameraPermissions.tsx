import {
  getCameraPermissionsAsync,
  requestCameraPermissionsAsync,
} from 'expo-camera';
import {setPersistence} from 'firebase/auth';
import {useEffect, useState, FunctionComponent, useCallback} from 'react';
import {Alert, Platform} from 'react-native';

/**
 * Custom hook for camera permission
 */

export const useeCameraPermissionsHook = () => {
  const [requestedPermission, setRequestedPermission] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  const getCameraPermission = () => {
    console.log('get Camera Permission');
    getCameraPermissionsAsync()
      .then(promise => {
        setPermissionStatus(promise.status);
      })
      .catch(error => {
        Alert.alert('Something went wrong while fetching camera permissions.');
      });
  };

  const requestCameraPermission = () => {
    console.log('request camera Permissions');
    requestCameraPermissionsAsync()
      .then(promise => {
        setPermissionStatus(promise.status);
      })
      .catch(error => {
        Alert.alert(
          'Something went wrong while requesting camera permissions.',
        );
      });
  };

  return {
    permissionStatus,
    getCameraPermission,
    requestCameraPermission,
    setPermissionStatus,
  };
};
