import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
//import { fetchCount } from './counterAPI';

import {UserState, UserInvalidForms, User, Criteria } from './types'

const initialState: UserState = {
  status: 'idle',
  users: [],
  queryUsers: [],
  countries: [],
  userById: null,
  loadingUsers: false
};



// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) => {
    //-- const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    //-- return response.data;
  }
);










function validateUserData(formData:any, invalids:any){
  if(!formData.username){
    invalids.username = 'Username is required'; 
    return invalids;
  }   
  if( !formData.email){
    invalids.email = 'Email is required';
    return invalids; 
  }
  if( formData.phone && /[^0-9]/.test(formData.phone)){
    invalids.phone = 'Only numbers allowed'; 
    return invalids;
  }
  if( formData.profileName && /[^A-Za-z0-9_-]/.test(formData.profileName)){
    invalids.profileName = 'Invalid characters. Allowed only letters, numbers, underscores and hyphen '; 
    return invalids;
  }
  if( !formData.country){
    invalids.country = 'Country is required'; 
    return invalids;
  }
  if( formData.username && /[^A-Za-z0-9_-]/.test(formData.username)){
    invalids.username = 'Invalid characters. Allowed only letters, numbers, underscores and hyphen '; 
  }
  if( !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(formData.email)){
    invalids.email = 'Email is invalid'; 
  }
  return invalids;
}




export const requestGetUsers =

  (args: {d: Criteria|undefined|null, cb?: Function}|any ): AppThunk =>
  (dispatch, getState) => {

  let dd: Criteria|undefined|null;
  if(args.hasOwnProperty('d')){
    dd = args.d;
  }else{
    dd = args as any;
  }

  const currentState: any = getState();   

  if (  (!currentState.user.users || currentState.user.users.length === 0) && currentState.user.loadingUsers === false){  
    
    dispatch(setLoadingUsers(true));

    fetch('data.json')
    .then(response=> response.json())
    .then(response=>{                   
      dispatch(initUsers(response));

      dispatch(getUsers(dd));  

      if(args.cb){
        args.cb(); 
      }    

      console.log('JSON data fetched successfully')

      dispatch(setLoadingUsers(false));

    }).catch(error => {

      console.error('Loading data.json error!', error);
       dispatch(setLoadingUsers(false));
    });

  } else { 
    dispatch(getUsers(dd));
   // dispatch(getUsers(d));
  }
};




export const requestCreateUser =
  (formData: User|null|undefined ): AppThunk =>
  (dispatch, getState) => {


    let invalids: UserInvalidForms = { 
      ALL: false
    };

    if(!formData) { 
      invalids.ALL = true;
      return invalids; 
    }

    invalids = validateUserData(formData, invalids);

    
    if ( Object.keys(invalids).length > 1 &&  invalids.ALL === false){  
      return invalids;
    }

    
    const currentState: any = getState(); 

    let exist = currentState.user.users.find( (user: User) => user.email === formData.email);
    if(exist) {
      invalids.email = 'Email exists already'; 
      return invalids;
    }

    exist = currentState.user.users.find( (user: User) => user.username === formData.username);
    if(exist) {
      invalids.username = 'Username exists already';
      return invalids;
    }

    dispatch(createUser(formData)); 


    return invalids;

};




export const requestUpdateUser =
  (formData: User ): AppThunk =>
  (dispatch, getState) => {


    let invalids: UserInvalidForms = { 
      ALL: false
    };

    if(!formData) { 
      invalids.ALL = true;
      return invalids; 
    }

    invalids = validateUserData(formData, invalids);

    
    if ( Object.keys(invalids).length > 1 &&  invalids.ALL === false){  
      return invalids;
    }

    
    const currentState: any = getState(); 

    let exist = currentState.user.users.find( (user:  User) => user.email === formData.email);
    if (exist  && exist.id!== formData.id ) {
      invalids.email = 'Email exists already'; 
      return invalids;
    }

    exist = currentState.user.users.find( (user: User) => user.username === formData.username);
    if (exist  && exist.id!== formData.id ) {
      invalids.username = 'Username exists already';
      return invalids;
    }

    dispatch(updateUser({id: formData.id ,formData:formData})); 


    return invalids;

};




export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

    setLoadingUsers: (state,action) => { 
      state.loadingUsers = action.payload;
    },

    initUsers: (state, action) => { 

      state.users = action.payload;
    },

    createUser: (state, action) => { 
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      //---- state.value += 1;

      let newUser = {...action.payload};
      newUser.id = state.users.length + 1;
      state.users.push(newUser);  
    },
    
    updateUser: (state, action) => { 

      const id  = action.payload.id; 
      let formData = action.payload.formData;
      let userObj:any = state.users.find(  (user:any) => user.id === id);
      for (let i in formData) {
        if (userObj && i!=='buildings'){
           userObj[i] = formData[i];
        }
      }
      
    },

    
    updateUserBuildings: (state, action) => { 
      /* this function is called from another slicer: building */
      const userIndex = action.payload.userIndex;
      const buildings = action.payload.buildings;
      state.users[userIndex].buildings = buildings;

    },   


    removeUser: (state, action: PayloadAction<any>) => {  

      const formData:any =  action.payload;

      state.users = state.users.filter((user:any) => user.id !== formData.id);
      state.queryUsers = state.queryUsers.filter((user:any) => user.id !== formData.id);

    },

    getUsers: (state, action: PayloadAction<any>) =>  {   
      let criteria:any =  action.payload;
      let users = [];
      for(let u=0; u < state.users.length; u++){
        let user = state.users[u];
        let getIt = true;

        if(!criteria){
          users.push(user);
        } else {
           
                        /* userid */
                        if(criteria.id && criteria.id >= 0 ){  

                          if(user.id === criteria.id){
                          //  getIt = true;
                          }else{
                            getIt = false; 
                          }

                        }

                        let criteriaAttrib = ['username','email','profileName','country','phone', 'role'];
                        for (let a=0; a< criteriaAttrib.length; a++){

                          const regex = new RegExp(criteria[ criteriaAttrib[a] ], 'gi');

                          if ( criteria[ criteriaAttrib[a] ] ){    
                            if( 
                                  (criteria[ criteriaAttrib[a] ] === user[ criteriaAttrib[a] ]) || ( user[ criteriaAttrib[a] ] && user[ criteriaAttrib[a] ].toString().match(regex) )  
                              
                              ){

                            }else{
                              getIt = false;   
                            }
                          }
                        }


                        if(getIt){
                          users.push(user);
                        }        
        }

      }

      state.queryUsers = users; 

      if (Object.keys(criteria).length ===1 && criteria.hasOwnProperty('id') && users.length>0){

        state.userById = {...users[0] }; 

      } 
      //return users;

    }

















  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  /*
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
       //-- state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
       //-- state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
       //-- state.status = 'failed';
      });
  },
*/
});


export const { createUser, updateUser, updateUserBuildings,  removeUser , getUsers, initUsers, setLoadingUsers} = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
//-----export const selectCount = (state: RootState) => state.counter.value;

export const users = (state: RootState) => state.user.users;


// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

/*
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }

  };
*/
export default userSlice.reducer;
