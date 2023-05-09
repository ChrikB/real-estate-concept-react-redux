import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './../app/hooks';
import { useSearchParams, useParams  } from "react-router-dom";

import BuildingDetails from './../components/building/BuildingDetails' 

import {Building} from './../components/building/types' 
import { 
  getBuildings,
  requestGetBuildings
} from './../components/building/buildingSlice';
import {
  requestGetUsers,
  updateUserBuildings
} from './../components/user/userSlice';




function BuildingDetailsView(){

  require('./BuildingDetailsView.css');

  const dispatch: Function = useAppDispatch();

  const [building, setBuilding] = useState<Building|null>(null);

  let [searchParams, setSearchParams] = useSearchParams();

  const buildingById = useAppSelector(store => store.building.buildingById);

  const { id } = useParams();  

  const users = useAppSelector(store => store.user.users);



  const doSearch = () => {

    let criteria:any;   

    if (!id){
      return;
    }       

    let buildingId =  parseInt(id, 10);  

    if (buildingId && buildingId >=0){

      criteria = {buildingId: buildingId}; 

    } else { 
      setBuilding(null);
      return;
    }


    if ( (!users || users.length ===0) ){

      dispatch(  
        requestGetUsers({ 
          d: {}, 
          cb: function(){ 
            dispatch(requestGetBuildings(criteria));
          }   
        })   
      );

    } else {
      dispatch(requestGetBuildings(criteria)); 
    }

  }
  


  useEffect(() => {

    doSearch(); 

  }, []); 




  useEffect(() => {  

    /* 
      just a useless function to make graphs a bit dynamic. 
      It increases visits.
      In the original app, visit counters come from Google
     */
    if (!buildingById || !buildingById.assingTo){
      return;
    }

    let userIndex = -1;
    let userBuildings = [];

    for(let u=0; u < users.length; u++){

      for(let a=0; a < users[u].buildings.length; a++){

        let buildingClone = {...users[u].buildings[a]};

        if (users[u].id === buildingById.assignTo){

              if (users[u].buildings[a].id === buildingById.id){

                    userIndex = u;

                    if (!buildingClone.visits){
                      buildingClone.visits = 1;
                    } else { 
                      buildingClone.visits = parseInt(buildingClone.visits.toString(), 10 ) + 1; 
                    }

              }

              userBuildings.push(buildingClone);
        }

      }

    }

    if (userIndex>-1) {
      let payload = {
        userIndex: userIndex,
        buildings: userBuildings
      };

      dispatch(updateUserBuildings( payload ));
    }

  }, [buildingById]);




  return (

      <section className="BuildingDetails  mb-4 mt-4 m-auto">
        <BuildingDetails buildingDataProp={buildingById} />
      </section>

  );
}

export default BuildingDetailsView