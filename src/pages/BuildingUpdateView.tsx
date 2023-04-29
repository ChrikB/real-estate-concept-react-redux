import React from 'react';
import { useSearchParams,useParams  } from "react-router-dom";
import { useState, useEffect } from 'react';

import BuildingFormUpdate from './../components/building/BuildingFormUpdate' 
import { useAppSelector, useAppDispatch } from './../app/hooks';

import {
  requestGetBuildings
} from './../components/building/buildingSlice';

import {Building} from './../components/building/types' 

import {
  requestGetUsers,
} from './../components/user/userSlice';



function BuildingUpdateView(){

  require('./BuildingUpdateView.css');

  const dispatch: Function = useAppDispatch();
  const users = useAppSelector(store => store.user.users);


  let [searchParams, setSearchParams] = useSearchParams();

  const buildingById = useAppSelector(store => store.building.buildingById);


  const { id } = useParams();       

  const [building, setBuilding] = useState<Building|null>(null);



  const doSearch = () => {

    let criteria:any;   
    if (!id){
      return;
    }       

    let buildingId =  parseInt(id, 10); 

    if (buildingId && buildingId >=0){
      
      criteria = {
        buildingId: buildingId
      }; 

    }else { 
      setBuilding(null);
      return;
    }

    if ( (!users || users.length ===0) ){
     
      dispatch(  requestGetUsers({ d: {}, cb: function(){dispatch(requestGetBuildings(criteria));}   })   );

    } else {

      dispatch(requestGetBuildings(criteria)); 
    }

  }
  


  useEffect(() => {
    doSearch();    
  }, []); 



  return (
    <section className="building-update  mb-4 mt-4 m-auto aw-100">
         
        <BuildingFormUpdate buildingDataProp={  buildingById  } />

    </section>
  ) 
  
}


export default BuildingUpdateView;





