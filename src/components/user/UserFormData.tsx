
import { useState, useEffect } from 'react';
import { useAppSelector } from './../../app/hooks';
import { RootState } from './../../app/store';

import { UserInvalidForms, User } from './types'


function UserFormData(props: {invalids: UserInvalidForms, formDataChanged: Function, formDataProp?: User}){

  require('./UserFormData.css');


  let defs = {
    countries: useAppSelector( (state): RootState => state.user.countries) ,
    d: {
      username: "",
      email: "",
      password: "",
      phone: "",
      country: "",
      profileName: "",
      profileAvatar: "",
      role: 2
    }
  };

  const [countries, setCountries] = useState(defs.countries);

  const [d, setD] = useState(defs.d);



  const isInvalid = (dProp: string) => {    

    if( props.invalids && props.invalids.hasOwnProperty(dProp) ){

      return true;
    }
    
    return false;
  }



  const updateUserData = (e: any, userProp: string) => {
        
    const newState: any = Object.assign({}, d);

    newState[userProp  as keyof User] = e.target.value;

    setD(newState);

    props.formDataChanged(newState);
  }



  const dataPropSynch = () => {   

    if(props.formDataProp) { 

      let dd =  JSON.parse(JSON.stringify(props.formDataProp));

      setD(dd);
    }
  }



  useEffect( () => { 

    dataPropSynch(); 

  } , [props.formDataProp] ) 



  return (
    <div className="userFormData-component">
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input 
          id="username" 
          aria-describedby="usernameHelp"
          type="text" 
          className={`form-control ${isInvalid('username') ? "is-invalid" : ""}` } 
          value={d.username}
          onChange={(evt) => updateUserData(evt, "username")}
          required
      />
        {
          props.invalids.username &&
            <div className="invalid-tooltip">{props.invalids.username}</div>
          
        }
        <div id="usernameHelp" className="form-text"></div>
      </div>

      <div className="mb-3">
        <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
        <input 
          id="exampleInputEmail" 
          aria-describedby="emailHelp"
          type="email" 
          className={`form-control ${isInvalid('email') ? "is-invalid" : ""}` } 
          onChange={(evt) => updateUserData(evt, "email")}
          value={d.email}
        />
        {
          props.invalids.email && 
            <div className="invalid-tooltip">{props.invalids.email}</div>
        }
        <div id="emailHelp" className="form-text"></div>
      </div>

      <div className="mb-3">
        <label htmlFor="inputPassword" className="form-label">Password (<span style={{"color":"red"}}>*</span>disabled for demo)</label>
        <input 
          id="inputPassword"
          type="password" 
          className="form-control" 
          onChange={(evt) => updateUserData(evt, "password")}
          disabled 
        />
      </div>

      <div className="mb-3">
        <label htmlFor="inputPhone" className="form-label">Phone</label>
        <input 
          placeholder="" 
          id="inputPhone" 
          aria-describedby="phoneHelp"
          type="number" 
          className={`form-control ${isInvalid('phone') ? "is-invalid" : ""}` }
          onChange={(evt) => updateUserData(evt, "phone")}
          value={d.phone}
        />
        {props.invalids.phone && 
          <div className="invalid-tooltip">{props.invalids.phone}</div>
        }
        <div id="phoneHelp" className="form-text"></div>
      </div>  

      <div className="mb-3">
        <label htmlFor="country" className="form-label">Country</label>
        <select 
          aria-label="Default select everywhere" 
          id="country-list"
          className={`form-select form-control ${isInvalid('country') ? "is-invalid" : ""}` } 
          value={d.country}
          onChange={(evt) => updateUserData(evt, "country")}
        >
          <option  value='' >Select country</option>
          { Array.isArray(countries) && countries.map(    ( option: any , index: number) => (<option   key={index}  value={option.long_name} >{option.long_name}</option>)    )  }

        </select>

        {props.invalids.country && 
        <div className="invalid-tooltip">{props.invalids.country}</div>
        }
        <div id="countryHelp" className="form-text"></div>
      </div>  

      <div className="mb-3">
        <label htmlFor="profileName" className="form-label">Profile Name (visible to others)</label>
        <input 
          id="profileName" 
          aria-describedby="profileNameHelp"
          type="text" 
          className={`form-control ${isInvalid('profileName') ? "is-invalid" : ""}` } 
          value={d.profileName}
          onChange={(evt) => updateUserData(evt, "profileName")}
        />
        {props.invalids.profileName && 
        <div className="invalid-tooltip">{props.invalids.profileName}</div>
        }
        <div id="profileNameHelp" className="form-text"></div>
      </div> 

      <div style={{"marginTop": "1.9rem"}}><hr className="bg-dark border-2 border-top border-dark" /></div>       
      <div className="mb-3">
        <label className="form-label" htmlFor="role">Role</label>
        <select 
          aria-label="Default select user" 
          id="role"
          className="form-select form-control"  
          value={d.role}
          onChange={(evt) => updateUserData(evt, "role")}
        >     
          <option value={1}>Admin</option>
          <option value={2}>User</option>
        </select>
      </div>

    </div>
  );  
}


export default UserFormData;