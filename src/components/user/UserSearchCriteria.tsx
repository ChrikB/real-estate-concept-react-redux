import { useState, useEffect } from 'react';

import { useAppSelector } from './../../app/hooks';


import { RootState } from './../../app/store';


import xcountriesx from './../../countries.json'
import { Country } from './types'


function UserSearchCriteria(props: {getCriteria: Function} ){
  
  require('./UserSearchCriteria.css');


  let defs = {
    countrySelectedIndex: "-1",
    countries: useAppSelector( (state): RootState => state.user.countries) ,
    defaults: {},
    criteria: {
      username: '',
      email:'',
      phone: '',
      country:'' as string|object|null|undefined,
      profileName: '',
      role: ""
    }
  };

  const [countrySelectedIndex, setCountrySelectedIndex] = useState<string>(defs.countrySelectedIndex);

  const [countries, setCountries] = useState<any>(defs.countries);
  
  const [defaults, setDefaults] = useState(defs.defaults);

  const [criteria, setCriteria] = useState(defs.criteria);
 


  useEffect( () => { 

     props.getCriteria(criteria) 

  } , [criteria] ) 



  useEffect( () => { 

    props.getCriteria(criteria) 

    if (countrySelectedIndex||countrySelectedIndex==="0"){

      let countryMapObj: Country = countries[parseInt(countrySelectedIndex, 10)]; 

      if (countryMapObj) {      

        setCriteria({...criteria, country: countryMapObj.long_name});
        return;
      }

      setCriteria({...criteria, country: null});
    }

   } , [countrySelectedIndex] ) 



  return (

  <div className="user-search-criteria m-auto">
    <form>
      <div className="input-group  form-check-inline align-items-center mb-3" id="_username">
        <label className="form-check-label ms-2 me-2" htmlFor="_username">Username</label>
        <input 
          type="text"  
          placeholder="Username" 
          aria-label="Username" 
          className="form-control"  
          value={criteria.username}
          onChange={e => { setCriteria({...criteria, username: e.target.value});  } } 
        />
      </div>  
      <div className="input-group  form-check-inline align-items-center mb-3"  id="_email">
        <label className="form-check-label ms-2 me-2" htmlFor="_email">Email</label>
        <input  
          placeholder="Email" 
          aria-label="Email" 
          type="text" 
          className="form-control"  
          value={criteria.email}
          onChange={e => {setCriteria({...criteria, email: e.target.value});}} 
        />
      </div> 
      <div className="input-group  form-check-inline align-items-center mb-3" id="_phone">
        <label className="form-check-label ms-2 me-2" htmlFor="_phone">Phone</label>
        <input 
          type="number" 
          className="form-control" 
          placeholder="Phone" 
          aria-label="Phone"
          value={criteria.phone} 
          onChange={e => {setCriteria({...criteria, phone: e.target.value});}} 
        />
      </div> 
      <div className="input-group  form-check-inline align-items-center mb-3"  id="_country">
        <label className="form-check-label ms-2 me-2" htmlFor="_country">Country</label>
        <select 
          className="form-select form-control" 
          aria-label="Default select example" 
          id="exampleCheck1"
          value={countrySelectedIndex}  
          onChange={e =>{setCountrySelectedIndex(e.target.value);} } 
          >
            <option  value="-1">Everywhere</option>  
            {   xcountriesx.map(     (option: any , index: number) => <option   key={index} value={index} >{option.long_name}</option>  )    }  

        </select>
      </div> 
      <div className="input-group  form-check-inline align-items-center mb-3" id="_profileName">
        <label className="form-check-label ms-2 me-2" htmlFor="_profileName">Profile Name</label>
        <input 
          placeholder="profileName" 
          aria-label="profileName"
          type="text" 
          className="form-control" 
          value={criteria.profileName} 
          onChange={e => {setCriteria({...criteria, profileName: e.target.value});}  } 
        />
      </div>       
      <div className="input-group  form-check-inline align-items-center  mb-3">
        <label className="form-check-label ms-2 me-2">Role</label>
        <select 
          className="form-select form-control" 
          aria-label="Default select example" 
          id="role" 
          value={criteria.role}
          onChange={e => {setCriteria({...criteria, role: e.target.value});}}  
        >     
          <option value="1">Admin</option>
          <option value="2">User</option>
          <option value="">All</option>
        </select>
      </div>        
    </form>
  </div>
  );
}


export default UserSearchCriteria;

