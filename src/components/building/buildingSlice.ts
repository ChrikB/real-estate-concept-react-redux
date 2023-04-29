import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';


import {BuildingState, BuildingInvalidForms, Building, BuildingCriteria } from './types'

import {updateUserBuildings, setLoadingUsers} from './../../components/user/userSlice';

const initialState: BuildingState = {
  status: 'idle',
  buildings: [],
  queryBuildings: [],
  countries: [],
  buildingById: null
};




/* helper function to simulate data validation on client side instead of server side */
function validateBuildingData(formData: any, invalids: any){

  if(!formData.buildingName){
    invalids.buildingName = 'Building Name is required'; 
    return invalids;
  }   

  if( formData.size || formData.size ===0 ){
    if(formData.size < 0){
      invalids.size = 'Size must be positive number'
      return invalids;
    }
  }
  else {
    invalids.size = 'Size is required' 
    return invalids;
  }

  if( formData.rooms || formData.rooms ===0 ){
    if(formData.rooms < 0){
      invalids.rooms = 'Rooms must be positive number'
      return invalids;
    }   
  }
  else{
    invalids.rooms = 'Rooms is required'
    return invalids;    
  }

  if( formData.floor  || formData.floor ===0 ){
  }else{
    invalids.floor = 'Floor is required' 
    return invalids;   
  }

  if( !formData.country){
    invalids.country = 'Country is required'; 
    return invalids;
  }

  if( !formData.pricePerDay){
    invalids.pricePerDay = 'Price is required'; 
    return invalids;
  }

  if( formData.pricePerDay  && formData.pricePerDay < 0 ){
    invalids.pricePerDay = 'Price can"t be negative number';
  }
  

  if(formData && formData.imgs && formData.imgs.length ===0 ){
    invalids.imgs = 'Put at least one photo'; 
  }
  if( formData.buildingName && /[^A-Za-z0-9_-\s]/.test(formData.buildingName)){
    invalids.buildingName = 'Invalid characters. Allowed only letters, numbers, underscores and hyphen '; 
    return invalids;
  }
  if( formData.buildingName && formData.buildingName.length < 5){
    invalids.buildingName = 'building name must have at least 4 characters'; 
  }
  if( formData.bundles){
    for(let m =0; m < formData.bundles.length; m++){
      if(!formData.bundles[m].bundlePrice || formData.bundles[m].bundlePrice==0){
        invalids.bundles = { key: m, text:'Price is required'}; 
        return invalids;
      }
      if(!formData.bundles[m].days || formData.bundles[m].days==0){
        invalids.bundles = { key: m, daystext:'"Days" field cant be null or zero '}; 
        return invalids;
      }

    }    
  }  
  return invalids;
}



/* Some custom Thunks */

export const requestGetBuildings =
  (args: {d: BuildingCriteria|undefined|null, cb?: Function}|any ): AppThunk =>
  (dispatch, getState) => {

  let dd: BuildingCriteria|undefined|null;
  if(args.hasOwnProperty('d')){
    dd = args.d;
  }else{
    dd = args as any;
  }
  
  const currentState: any = getState();

  if (!currentState.user.users || currentState.user.users.length === 0 && currentState.user.loadingUsers === false){  

    dispatch(setLoadingUsers(true));

    fetch('data.json')
    .then(response=> response.json())
    .then(response=>{  
      //dispatch(initUsers(response));
      dispatch(initBuildings(response));
      dispatch(getBuildings({criteria: dd, users: currentState.user.users}));  

      if(args.cb){
        args.cb(); 
      }

      dispatch(setLoadingUsers(false));

    });  
  } else {
    if (currentState.building.buildings.length===0) {        
      dispatch(initBuildings(currentState.user.users));
    }
    dispatch(getBuildings({criteria: dd, users: currentState.user.users}));

    if(args.cb){
      args.cb(); 
    }
  }
};



export const requestCreateBuilding =
  (formData: Building|null|undefined ): AppThunk =>
  (dispatch, getState) => {


    let invalids: BuildingInvalidForms = { 
      ALL: false
    };

    if(!formData) {  
      invalids.ALL = true;
      return invalids; 
    }

    invalids = validateBuildingData(formData, invalids); 
   
    if ( Object.keys(invalids).length > 1 &&  invalids.ALL === false){   
      return invalids;
    }

    

    const currentState: any = getState();

    let userByIdIndex = currentState.user.users.findIndex(  (user:any) => user.id.toString() === formData.assignTo.toString()); 

    if (userByIdIndex === -1){
      return invalids;
    }
    let blds:any = [];
    if(currentState.user.users[userByIdIndex].buildings){
      blds = [...currentState.user.users[userByIdIndex].buildings];
      formData.id = Date.now();
      blds.push(formData);
    }
    dispatch(updateUserBuildings( { userIndex: userByIdIndex, buildings: blds }  )); 
    dispatch(createBuilding({formData: formData}));

    return invalids;

};



export const requestUpdateBuilding =
  (formData: Building ): AppThunk =>
  (dispatch, getState) => {

  
    let invalids: BuildingInvalidForms = { 
      ALL: false
    };

    if(!formData) { 
      invalids.ALL = true;
      return invalids; 
    }

    invalids = validateBuildingData(formData, invalids);

    
    if ( Object.keys(invalids).length > 1 &&  invalids.ALL === false){  
      return invalids;
    }
 
    const currentState: any = getState();  

    let buildingIndex = currentState.building.buildings.findIndex(  (building: Building) => building.id === formData.id);    

    let buildingById = currentState.building.buildings[ buildingIndex ];

    if (buildingIndex>-1 && buildingById){

      let previousAssignTo = buildingById.assignTo;

      if (previousAssignTo != formData.assignTo) { 
        /* remove building from current user and assign to another */
        let buildingBelongsToUserIndexPrevious = currentState.user.users.findIndex(  (user: any) => user.id === previousAssignTo); 

        let userBuildingIndex = currentState.user.users[buildingBelongsToUserIndexPrevious].buildings.findIndex(  (building: Building) => building.id === formData.id);   



        let bldsCurrent = [...currentState.user.users[ buildingBelongsToUserIndexPrevious ].buildings];

        bldsCurrent.splice(userBuildingIndex, 1); 

        dispatch(updateUserBuildings( { userIndex: buildingBelongsToUserIndexPrevious, buildings: bldsCurrent }  )); 


        let blds:any = [];
        let buildingBelongsToUserIndex = currentState.user.users.findIndex(  (user: any) => user.id === formData.assignTo );

        if(currentState.user.users[ buildingBelongsToUserIndex ].buildings){
          
          blds = [...currentState.user.users[ buildingBelongsToUserIndex ].buildings];    
          blds.push(formData);
        } 

        dispatch(updateUserBuildings( { userIndex: buildingBelongsToUserIndex, buildings: blds }  )); 

        dispatch(updateBuilding( { buildingIndex: buildingIndex, formData: formData }  )); 


      } else {

        let buildingBelongsToUserIndex = currentState.user.users.findIndex(  (user: any) => user.id === formData.assignTo );
        let bldsCurrent = [...currentState.user.users[ buildingBelongsToUserIndex ].buildings]; 
        let userBuildingIndex = bldsCurrent.findIndex(  (building: Building) => building.id === formData.id); 

        bldsCurrent[userBuildingIndex] = {...formData};
  
        dispatch(updateUserBuildings( { userIndex: buildingBelongsToUserIndex, buildings: bldsCurrent }  )); 
        dispatch(updateBuilding( { buildingIndex: buildingIndex, formData: formData }  ));
      }


    }

  //  dispatch(updateBuilding({id: formData.id ,formData:formData})); 

    return invalids;

};




export const requestRemoveBuilding =
  (formData: Building ): AppThunk =>
  (dispatch, getState) => {


    let invalids: BuildingInvalidForms = { 
      ALL: false
    };

    if(!formData) { 

      invalids.ALL = true;
      return invalids; 
    }

    if (!formData.assignTo || !formData.id) { 

      return { assignTo : 'bulding missing id or assignTo property' };

    }

    const currentState: any = getState();  
    /* remove this building from User Class */
    let buildingBelongsToUserIndex = currentState.user.users.findIndex(  (user: any) => user.id === formData.assignTo );
    let bldsCurrent = [...currentState.user.users[ buildingBelongsToUserIndex ].buildings];

    let buildingIndex = bldsCurrent.findIndex(  (building: any) => building.id === formData.id );
    bldsCurrent.splice(buildingIndex, 1); 

    dispatch(updateUserBuildings( { userIndex: buildingBelongsToUserIndex, buildings: bldsCurrent }  )); 

    return invalids;
}



export const buildingSlice = createSlice({

  name: 'buildingSlice',

  initialState,

  reducers: {



    initBuildings: (state, action) => { 

      let buildings = [];

      let users = action.payload;
      for(let u=0; u < users.length; u++){

        let user = users[u];
 
        if(user.buildings){

            for(let b=0; b < user.buildings.length; b++){
              buildings.push(user.buildings[b]);
            }
        }

      } 

      state.buildings = buildings;
    },



    createBuilding: (state, action:  PayloadAction<any>) => { 

      state.buildings.push(action.payload.formData);

    },
    


    updateBuilding: (state, action) => {

      let buildingIndex = action.payload.buildingIndex;

      let formData = action.payload.formData;

      let bls = [...state.buildings];
      bls[buildingIndex] = {...formData};

      state.buildings = bls;
    },
    


    removeBuilding: (state, action: PayloadAction<any>) => {  

      const formData: any =  action.payload;

      state.buildings = state.buildings.filter((building: any) => building.id !== formData.id);
      state.queryBuildings = state.buildings.filter((building: any) => building.id !== formData.id);
 
    },



    getBuildings: (state, action: PayloadAction<any>) =>  { 

      let criteria:any =  action.payload.criteria;      

      let buildings: Building[] = [];      

      let users = action.payload.users;

      for (let u=0; u < users.length; u++){

        let user = users[u];
 
        if(user.buildings){ 
            if(!criteria){
 
              for(let b=0; b < user.buildings.length; b++){
                buildings.push(user.buildings[b]);
              }

            } else {

                for(let b=0; b < user.buildings.length; b++){
                  let building = user.buildings[b];
                  let getIt = true;

                  /* assignTo */
                  if(criteria.assignTo && criteria.assignTo >= 0 ){ 
                    if(parseInt(building.assignTo,10) === parseInt(criteria.assignTo,10)){      
                    //  getIt = true;
                    }else{
                      getIt = false;  
                    }
                  }
                  /* buildingId */
                  if(criteria.buildingId && criteria.buildingId >= 0 ){ 
                    if(building.id === criteria.buildingId){
                    //  getIt = true;
                    }else{
                      getIt = false;
                    }
                  }
                  /* floor */
                  if(criteria.floor || parseInt(criteria.floor,10) >= 0 ){ 
                    if(parseInt(building.floor) === parseInt(criteria.floor)){      
                    //  getIt = true;
                    }else{
                      getIt = false;  
                    }
                  }
                  /* country */
                  if(criteria.country){
                    if( building.country === criteria.country ){                
              //      getIt = true;
                    }else{
                      getIt = false;     
                    }    
                  }
                  /* min price */
                  if(criteria.pricePerDay && criteria.pricePerDay.min  && criteria.pricePerDay.min >=0){
                    if(building.pricePerDay && building.pricePerDay> criteria.pricePerDay.min){            
              //      getIt = true;
                    }else{
                      getIt = false; 
                    }   
                  }
                  /* max price */
                  if(criteria.pricePerDay && criteria.pricePerDay.max  &&criteria.pricePerDay.max >=0){
                    if(building.pricePerDay && building.pricePerDay <= criteria.pricePerDay.max){               
              //      getIt = true;
                    }else{
                      getIt = false;  
                    }
                  }

                  /* min size */
                  if(criteria.size && criteria.size.min && criteria.size.min >=0){
                    if(building.size && building.size > criteria.size.min){               
              //      getIt = true;
                    } else {
                      getIt = false;   
                    }
                  } 

                  /* max size */
                  if(criteria.size && criteria.size.max && criteria.size.max >=0){
                    if(building.size && building.size <= criteria.size.max){            
              //      getIt = true;
                    } else {
                      getIt = false;    
                    }
                  } 
                  /* availability */
                  if(criteria.availability){}
                  if(criteria.availableTomorrow){      

                    const today = new Date();
                    let tomorrow =  new Date();
                    tomorrow.setDate(today.getDate() + 1);
                    
                    if( criteria.availableTomorrow === building.availability 
                      || (Array.isArray(building.availability) && building.availability.length==0)  
                      || (Array.isArray(building.availability) && building.availability.includes(tomorrow))   
                    ) {                                                                                         
                //      getIt = true;
                    } else {
                      getIt = false;      
                    }
                  }


                  if(getIt){
                    buildings.push(building);
                  }   
                } //end of for

            }
        }
      }

      state.queryBuildings = buildings;
      
      if (Object.keys(criteria).length ===1 && criteria.hasOwnProperty('buildingId') && buildings.length>0){

        state.buildingById = {...buildings[0] };
      }


    }


  },

});


export const { createBuilding, updateBuilding,  removeBuilding , getBuildings, initBuildings} = buildingSlice.actions;


export const buildings = (state: RootState) => state.building.buildings;


export default buildingSlice.reducer;
