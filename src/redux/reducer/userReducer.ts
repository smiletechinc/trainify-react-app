import {User} from 'firebase/auth';
import {act} from 'react-test-renderer';
import {AnyAction} from 'redux';
import {UserObject, UserState} from '../../../types';
import * as actionTypes from '../action/actionTypes';

const initialState: UserState = {
  authUser: {
    id: 'null',
    email: 'null',
    playerstyle: 'null',
    gender: 'male',
    height: 'null',
    birthday: 'null',
    location: 'null',
    rating: 'null',
    nationality: 'null',
    firstName: 'null',
    middleName: 'null',
    lastName: 'null',
    userType: 'null',
    paymentPlan: 'null',
  },
};

const userReducer = (
  state: UserState = initialState,
  action: AnyAction,
): UserState => {
  console.log('add a user in reducer', action.userSession);
  switch (action.type) {
    case actionTypes.USER_LOGIN:
      const newUser: UserObject = {
        id: action.userSession.id,
        email: action.userSession.email,
        playerstyle: action.userSession.handStyle,
        gender: action.userSession.gender,
        height: action.userSession.height,
        birthday: action.userSession.birthday,
        location: action.userSession.location,
        rating: action.userSession.rating,
        nationality: action.userSession.nationality,
        firstName: action.userSession.firstName,
        middleName: action.userSession.middleName,
        lastName: action.userSession.lastName,
        userType: action.userSession.userType,
        paymentPlan: action.userSession.paymentPlan,
      };
      return {
        ...state,
        authUser: newUser,
      };
    default: {
      return state;
    }
  }
};

export default userReducer;
