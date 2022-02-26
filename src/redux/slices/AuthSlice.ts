/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable arrow-parens */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserObject} from '../../types';

export interface RegisterState {
  UserData: UserObject;
}

const initialState: RegisterState = {
  UserData: null,
};

export const RegisterReducer = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setUserRegistrationData: (
      state,
      action: {
        payload: [string, string];
        type: string;
      },
    ) => {
      state.UserData[action.payload[0]] = action.payload[1];
    },
    setUserObject: (
      state,
      action: {
        payload: UserObject;
        type: string;
      },
    ) => {
      state.UserData= action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUserRegistrationData, setUserObject} =
  RegisterReducer.actions;

export default RegisterReducer.reducer;
