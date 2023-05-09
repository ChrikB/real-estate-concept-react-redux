

import UserSearchResults from './../components/user/UserSearchResults' 
import UserSearchCriteria from './../components/user/UserSearchCriteria' 
import {useEffect} from 'react';
import { useAppSelector, useAppDispatch } from './../app/hooks';

import {
  removeUser,
  requestGetUsers
} from './../components/user/userSlice';


import { User, Criteria }  from './../components/user/types';



function UserSearchView(){

  require('./UserSearchView.css');

  const usersz = useAppSelector(store => store.user.users);

  const dispatch: Function = useAppDispatch();

  const usersQuery = useAppSelector(store => store.user.queryUsers);


  const removeUserz = (obj: User) => {

    dispatch(removeUser(obj));

  };



  const updateCriteria = (criteria: Criteria) => {

    dispatch(requestGetUsers(criteria));
  }



  useEffect(() => {

    dispatch(requestGetUsers({}));
    
  }, []);



  return (
    <section className="users p-1 p-md-4 pt-0">
      <div  className="product-list-view">
        <h5 className="mt-3 mb-3">
          <u className="p-2">Search Users</u>
        </h5>
      </div>
      <div className="search-criteria-container">
        <UserSearchCriteria getCriteria={updateCriteria} />
      </div>
      <div>
        <h5 className="mb-4 mt-4 h-title">Results</h5>
        <div className="row">
          <div className="col-12">
            <UserSearchResults userSearchResultsProp={usersQuery} removeUser={removeUserz}/>
          </div>
        </div>
      </div>
    </section>
  ); 
}

export default UserSearchView;




