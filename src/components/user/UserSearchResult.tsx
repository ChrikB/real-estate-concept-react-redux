
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { User }  from './types'



function UserSearchResult(props: {userSearchResult: User, removeUser: Function} ){

  require('./UserSearchResult.css');

  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  

  const getUserBuildings = () =>{

    let userId = props.userSearchResult.id;

    navigate( '/buildings?assignTo=' + userId + '&username=' + props.userSearchResult.username);
  }



  const delUser = () => {
    props.removeUser(props.userSearchResult); 
  };



  return (
    <div 
    className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4" 
    _v-if="userSearchResult"
  >            
    <div className="userSearchResult-component pt-3 pb-3">
      <div className="position-relative"   >
        <svg  
          onClick={(e)=>delUser()}
          style={{ right:'5%', top:'5%'}}
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          className="bi bi-x-lg position-absolute" 
          viewBox="0 0 16 16"
        >
          <path   d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>

        <svg 
            onClick={(e)=>navigate( '/user/' + props.userSearchResult.id)}
            style={{ left:'5%', top:'5%'}}
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            fill="currentColor" 
            className="bi bi-pencil-square position-absolute" 
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>
      </div>

      <div data-user="username" className="user-username">
        <div className="fw-bold">Username</div>
        <span>{props.userSearchResult.username}</span>
      </div>

      <div data-user="email" className="user-email">
        <div className="fw-bold">Email</div>
        <span>{props.userSearchResult.email}</span>
      </div>

      <div data-user="phone" className="user-phone">
          <div className="fw-bold">Phone</div>
          <span>{(props.userSearchResult.phone)?props.userSearchResult.phone:'-'}</span>
        </div>
  
      <div data-user="profileName" className="user-profileName">
          <div className="fw-bold">ProfileName</div>
          <span>{(props.userSearchResult.profileName)?props.userSearchResult.profileName:'-'}</span>
      </div>

      <div data-user="country" className="user-country">
          <div className="fw-bold d-inline-block me-2">Country</div>
          <span>{props.userSearchResult.country}</span>
        </div> 
  
      <div data-user="role" className="user-role">
          <div className="fw-bold d-inline-block me-2">Role</div>
          <span>{([1,'1'].includes(props.userSearchResult.role))?'admin':'user'}</span>
      </div>

      <div data-user="userBuildings"    className="user-buildings">
          <div className="fw-bold d-inline-block me-2">
            <button 
              onClick={getUserBuildings} 
              className="btn btn-sm btn-secondary"
            >Buildings : { (props.userSearchResult.buildings?props.userSearchResult.buildings.length:0)  }
            </button>
          </div>
      </div>


    </div>
  </div>

  );

}


export default UserSearchResult;







