
import BuildingFormInsert from './../components/building/BuildingFormInsert' 

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './../app/hooks';
import {
  requestGetUsers,
} from './../components/user/userSlice';



function BuildingInsertView(){

  require('./BuildingInsertView.css');

  const dispatch: Function = useAppDispatch();
  const users = useAppSelector(store => store.user.users);

  useEffect(() => {

    if ( (!users || users.length ===0) ){
      dispatch(  requestGetUsers({})   );
    } 

  }, []);

  return (
    <section className="building-add  mb-4 mt-4 m-auto aw-100">
      { users.length>0 && 
       <BuildingFormInsert />
      }
    </section>
  );
}

export default BuildingInsertView;





