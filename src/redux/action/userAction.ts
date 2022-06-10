import {act} from 'react-test-renderer';
import {UserObject} from '../../../types';
import * as actionTypes from './actionTypes';

export const userstatus = (userSession: UserObject) => {
  console.log('useraction called');
  return {
    type: actionTypes.USER_LOGIN,
    userSession,
  };
};
