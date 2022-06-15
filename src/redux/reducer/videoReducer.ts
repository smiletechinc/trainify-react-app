import {User} from 'firebase/auth';
import {act} from 'react-test-renderer';
import {AnyAction} from 'redux';
import {UserObject, UserState, Video, VideoState} from '../../../types';
import * as actionTypes from '../action/actionTypes';

const initialState: VideoState = {
  videos: [
    {
      id: 0,
      createrId: '',
      duration: 0,
      fileName: '',
      fileSize: 0,
      name: '',
      thumbnailURI: '',
      thumbnailURL: '',
      type: '',
      timestamp: '',
      videoURI: '',
      videoURL: '',
      width: 0,
      analysisData: [],
    },
  ],
};

const videoReducer = (
  state: VideoState = initialState,
  action: AnyAction,
): VideoState => {
  console.log('add a user in reducer', action.userSession);
  switch (action.type) {
    case actionTypes.USER_LOGIN:
      return {
        ...state,
        videos: action.vidoes,
      };
    default: {
      return state;
    }
  }
};

export default videoReducer;
