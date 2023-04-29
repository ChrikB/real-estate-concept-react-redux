import { configureStore, ThunkAction, Action , combineReducers } from '@reduxjs/toolkit';



import userReducer from '../components/user/userSlice';
import buildingReducer from '../components/building/buildingSlice';

import {Country} from '../components/user/types';

import xcountries from './../countries.json'


const rootReducer = combineReducers({
  user: userReducer,
  building: buildingReducer
})


export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    
    user: {
      status: 'idle',
      users: [],
      queryUsers: [],
      countries: xcountries,
      userById: null,
      loadingUsers: false
    } 

  }
});



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;   //  export type RootState = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
