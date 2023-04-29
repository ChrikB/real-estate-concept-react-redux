

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './../app/hooks';
import { useSearchParams, useParams, createSearchParams,useNavigate  } from "react-router-dom";

import BuildingSearchCriteria from './../components/building/BuildingSearchCriteria' 
import BuildingSearchResults from './../components/building/BuildingSearchResults' 

import {BuildingState, BuildingInvalidForms, Building, BuildingCriteria } from './../components/building/types'

import {
  removeBuilding, 
  requestGetBuildings
} from './../components/building/buildingSlice';

import {
  removeUser,requestGetUsers,
  getUsers
} from './../components/user/userSlice';


function BuildingSearchView(){

  const navigate = useNavigate();
  
  const dispatch: Function = useAppDispatch();

  let [searchParams, setSearchParams] = useSearchParams();

  const [buildings, setBuildings] = useState<Array<Building>>([]);

  const buildingsQuery = useAppSelector(store => store.building.queryBuildings);

  const users = useAppSelector(store => store.user.users);

  const [criteria, setCriteria] = useState<any>();

  const [criteriaVisibillity, setCriteriaVisibillity] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  


  const criteriaFromUrl = () => {

    let criteria: any = {};

    searchParams.forEach(function(value, key){
      criteria[ key ] = value;
    });

    return criteria;
  };



  const updateCriteria = (criteria: BuildingCriteria) => {  

    
    let assignTo = searchParams.get('assignTo');
    if (assignTo) {
      criteria.assignTo = assignTo;
    }
    let username = searchParams.get('username');
    if (username) {
      criteria.username  = username ;
    }

   
    let params:any = {...criteria};

    params.pricePerDayMin = params.pricePerDay.min;
    params.pricePerDayMax = params.pricePerDay.max;
    params.sizeMin = params.size.min;
    params.sizeMax = params.size.max;    
    delete params.pricePerDay;
    delete params.size;

    let searchPath = createSearchParams(params).toString();
    navigate({pathname:'',search: searchPath});

  }



  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  function conv(a: any){
    if(a==='true'){ return true;}
    if(a==='false'){ return  false;}
    if(a==='0'){ return  0;}
    if(a==='1'){ return  1;}
    if(a==='null'){ return  "";}
    if(a==='undefined'){ return  '';}
    if(isNumeric(a)) {
      return parseInt(a, 10); 
    }
    return a;
  };





  const doSearch = () => {

    if (loading === true){
      return;
    }
    
    let criteria =  criteriaFromUrl();

    for (let [ d, value ] of Object.entries(criteria) ){ 

        criteria[d] = conv(value);
    }

    /* get rid of temporary properties and retrieve nested again */
    criteria.pricePerDay = {
      min: criteria.pricePerDayMin, 
      max: criteria.pricePerDayMax
    }
    criteria.size = {
      min: criteria.sizeMin, 
      max: criteria.sizeMax
    }
    delete criteria.pricePerDayMin;
    delete criteria.pricePerDayMax;
    delete criteria.sizeMin;
    delete criteria.sizeMax;

    setCriteria(criteria);

    setLoading(true);

    if ( (!users || users.length ===0) ){
  
        dispatch(  
          requestGetUsers({ 
            d: {}, 
            cb: function(){ 

              dispatch(
                requestGetBuildings(criteria)
              ); 

              setLoading(false);
            }  

          })   
        );

    } else {

        dispatch(
          requestGetBuildings(criteria)
        );

        setLoading(false);
    }

  }



  useEffect(() => {
 
    doSearch(); 

  }, []);



  useEffect(() => { 
 
    if ( Object.keys(criteriaFromUrl()).length>0) {
      setCriteriaVisibillity(true);
    } else {
      setCriteriaVisibillity(false);
    }

    doSearch(); 

  }, [searchParams]);



  return (
    <section className="buildings">
    <div className="product-list-view"></div>
    <div  className={"search-criteria-container" + criteriaVisibillity?'':'d-none' }>
      { criteriaVisibillity && 
      <h5 className="mt-3 mb-3">
        <u className="p-2">Search Buildings</u>
      </h5>
      }
      { criteriaVisibillity && 
      
      <BuildingSearchCriteria  criteriaProp={criteria} getCriteria={updateCriteria} />
      }
    </div>
    <div>
      <h5 className="mb-5 mt-4 h-title">Buildings for rent</h5>
      <div className="row">
        <div className="col-12" >
            <BuildingSearchResults buildingSearchResultsProp={buildingsQuery} />
        </div>
      </div>
    </div>
  </section>
  );
}

export default BuildingSearchView;



