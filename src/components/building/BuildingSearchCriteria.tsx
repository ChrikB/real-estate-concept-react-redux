
import { useSearchParams, useParams, createSearchParams,useNavigate  } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useRef, createRef, RefObject } from "react";
import { useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import { BuildingCriteria }  from './types'
import { 
  requestCreateBuilding
} from './buildingSlice';


export default function BuildingSearchCriteria( props: { getCriteria: Function , criteriaProp: BuildingCriteria }) {

  require('./BuildingSearchCriteria.css');

  const dispatch: Function = useAppDispatch();

  let defs = {
    defaults: {},
    criteria: {
     // username: '',
      assignTo: '',
     // name: '',
      country: '',
      floor: '',
      pricePerDay:{
        min: 0,
        max: 10000
      },
      size: {
        min: 0,
        max: 10000
      },
    //  availability: false,
      availableTomorrow: false
    }
  };

  const [defaults, setDefaults] = useState(defs.defaults);

  const [criteria, setCriteria] = useState(defs.criteria);



  const updateCriteria = (prop: any, value: any) =>{

    let newCriteria: any = {};
    newCriteria[prop] =  value;

    let cri = {...criteria, ...newCriteria }; 

    setCriteria(cri); 

    props.getCriteria(cri);
  }
 

  

  useEffect( () => { 
 
    synchPropsWithData();

  }, [props.criteriaProp]);



  useEffect( () => { 

    synchPropsWithData();

  }, []);



  const synchPropsWithData = (buildingSearchCriteriaProp?: BuildingCriteria)=> {

    let propCrit;

    if (buildingSearchCriteriaProp) {
      propCrit = buildingSearchCriteriaProp;
    } else {
      propCrit = props.criteriaProp;
    }   

    if (propCrit) {

      let converted = convertBooleans( propCrit );  
      let crit = {...criteria, ...converted}   
 
      setCriteria(crit);        

    } else {

      setCriteria({...defs.criteria});    
    }
  }



  const convertBooleans = (obj: any) => {

    if(!obj) {
      return;
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

  
    let newObj = {...obj};
 
    for (let [ d, value ] of Object.entries(defs.criteria)  ){   

      if (obj.hasOwnProperty(d) ) {   

        if (d==='size' || d==='pricePerDay'){  

          if ( typeof newObj[d] === "object"  && newObj[d].hasOwnProperty('min') ) {
            newObj[d]['min'] =  conv(newObj[d].min);  
          }

          if ( typeof newObj[d] === "object"  && newObj[d].hasOwnProperty('max') ) {
            newObj[d]['max'] = conv(newObj[d].max);  
          }

        } else {     

          newObj[d as keyof BuildingCriteria] = conv(newObj[d]);  

        }

      }

    }
  
    return newObj;

  };



  const parseIntInput = (inputValue: string|number|undefined) => {

    return ( (  inputValue||inputValue===0||inputValue==="0"  )?parseInt(inputValue.toString(), 10) : '');
  }



  return (


    <div className="building-search-criteria aw-50 m-auto">
    <form className="w-50 m-auto">
      { props.criteriaProp && props.criteriaProp.assignTo && <h6 style={{color:"#2f6613"}}> Buildings by user:  { props.criteriaProp.username} </h6> }
      <div className="input-group  form-check-inline mb-3">
        <input 
          type="number" 
          min="-50" 
          step="1"       
          className="form-control" 
          placeholder="Floor" 
          aria-label="floor"
          value={parseIntInput(criteria.floor)}
          onChange={e => { updateCriteria('floor', parseIntInput(e.target.value))   } } 
        />
      </div>
      <div className="input-group form-check-inline mb-3 align-items-center">  
        <label className="form-check-label ms-2 me-2">Price</label>
        <input 
          type="number" 
          className="form-control" 
          placeholder="Min" 
          aria-label="price-min"
          value={ parseIntInput(criteria.pricePerDay.min) }
          onChange={e => { updateCriteria('pricePerDay', { min: parseIntInput(e.target.value), max: criteria.pricePerDay.max })   } } 
        /> 
        <input 
          type="number" 
          className="form-control" 
          placeholder="Max" 
          aria-label="price-max"
          v-model="criteria.pricePerDay.max"
          value={ parseIntInput(criteria.pricePerDay.max) }
          onChange={e => { updateCriteria('pricePerDay', { min: criteria.pricePerDay.min, max: parseIntInput(e.target.value) })   } }           
        />
      </div>
      <div className="input-group form-check-inline mb-3 align-items-center">
        <label className="form-check-label ms-2 me-2">Size(Sq.M)</label>
        <input 
          placeholder="From" 
          aria-label="size-min"
          type="number" 
          className="form-control" 
          value={ parseIntInput(criteria.size.min) }
          onChange={e => { updateCriteria('size', { min: parseIntInput(e.target.value), max: criteria.size.max })   } } 
        />
        <input 
          placeholder="To" 
          aria-label="size-max"
          type="number" 
          className="form-control" 
          value={parseIntInput(criteria.size.max)}
          onChange={e => { updateCriteria('size', { min: criteria.size.min, max: parseIntInput(e.target.value) })   } }
        />
      </div>   
      <div className="form-check  form-check-inline availability-check">
        <input 
          className="form-check-input"  
          type="checkbox" 
          checked={ (criteria.availableTomorrow)?true:false}
          id="flexCheckDefault"
          onChange={e => { updateCriteria('availableTomorrow', !!e.target.checked)   } }
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">Available <u>tomorrow</u></label>
      </div>   
    </form>
  </div>

  );
}

