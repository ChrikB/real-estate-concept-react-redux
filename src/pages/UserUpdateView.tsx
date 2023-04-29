
import { useSearchParams,useParams  } from "react-router-dom";
import { useEffect } from 'react';

import UserFormUpdate from './../components/user/UserFormUpdate' 
import { useAppSelector, useAppDispatch } from './../app/hooks';

import {
   getUsers
 } from './../components/user/userSlice';



function UserUpdateView(){

  require('./UserUpdateView.css');

  const dispatch: Function = useAppDispatch();

  let [searchParams] = useSearchParams();

  const userById = useAppSelector(store => store.user.userById);

  const { id } = useParams();       



  const doSearch = ()=> {

    const pZarams: any = [];

    searchParams.forEach((value, key) => {
      pZarams.push([key, value]);
    });

    let criteria;

    let userId: any = id;   

    if (userId && parseInt(userId,10) >=0){
      criteria = {
        id: parseInt(userId,10)
      }; 
    } else { 

      return;
    }

    dispatch(getUsers(criteria)); 


  };



  useEffect(() => {
      doSearch();    
  }, []); 



  
  return (
    <section className="user-add  mb-4 mt-4 m-auto">
       <UserFormUpdate userDataProp={userById} />
    </section>
  ) 
}

export default UserUpdateView;
