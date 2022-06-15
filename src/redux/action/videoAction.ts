import {act} from 'react-test-renderer';
import {UserObject, Video} from '../../../types';
import * as actionTypes from './actionTypes';

export const updateVideos = (vidoes: Video) => {
  console.log('updated colors called', JSON.stringify(vidoes));

  return {
    type: actionTypes.UPDATE_VIDEOS,
    vidoes,
  };
};
