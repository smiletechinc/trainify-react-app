/* eslint-disable arrow-parens */
import {configureStore} from '@reduxjs/toolkit';
import RegisterReducer from './src/redux/slices/AuthSlice';
import {api} from './src/network';
import {setupListeners} from '@reduxjs/toolkit/query';
import {combineReducers} from "redux"; 
import thunk from 'redux-thunk';
import {
  persistReducer,
  
} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistGate } from 'redux-persist/integration/react'
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
}
const reducers = combineReducers({
  RegisterReducer,         
 });

const persistedReducer = persistReducer(persistConfig, reducers)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
