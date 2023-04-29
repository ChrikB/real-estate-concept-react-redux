
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useRef, createRef, RefObject } from "react";
import { useState, useEffect } from 'react';

import  UserFormData from './../../components/user/UserFormData'

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import { UserInvalidForms, User }  from './types'
import { 
  requestCreateUser
} from './userSlice';





function UserFormInsert(){

  require('./UserFormInsert.css');


  const dispatch: Function = useAppDispatch();

  const [formData, setFormData] = useState<User|null|undefined>(null);

  const [show, setShow] = useState(false);/* modal */

  const [modalMessage, setModalMessage] = useState('');/* modal */

  const [invalids, setInvalids] = useState({});/* invalids */

  const lastEntryEmail: {[current:string]:any} = useRef(null);//   

  const lastentry = useRef<HTMLDivElement>(null!);       

  const modalbtn = useRef<HTMLButtonElement>(null!);

  const modalBody = useRef<HTMLDivElement>(null!);  

  const currentUsers = useAppSelector(store => store.user.users);



  const onFormDataUpdated = (formData: User ) => {
    setFormData(formData);

   // if (formData.email != lastEntryEmail) {
      lastentry.current.innerHTML = '';
   // }

  }



  const add = () => {

    let invalids = dispatch(requestCreateUser(formData));  
    
    if (!invalids.ALL) {    
      setInvalids(invalids);
      let invalidsLen: number = Object.keys(invalids).length;
      if (invalidsLen === 0  || (invalidsLen === 1 && invalids.hasOwnProperty('ALL')) ) {
        setModalMessage("Entry inserted successfully");
        setShow(true); 
        lastentry.current.innerHTML = 'Last entry : ' + formData?.email;
        lastEntryEmail.current = formData?.email!;
      }
    } else {
      setModalMessage("Form cannot be empty");
      setShow(true);
    }

  }


  
  return (
    <div>

      <form className="UserFormInsert-component">   

        <UserFormData 
          formDataChanged={onFormDataUpdated}
          invalids={invalids}
         // formDataProp={props.userDataProp}
        />   

        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={ (e)=>  add()  }
        >Add</button>
        <div className="lastentry" ref={lastentry} ></div>

      </form>
    

      <Modal
        show={show}
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body>
          <p>
           {modalMessage}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={(e)=>  {setShow(false);} }>Close</Button>
        </Modal.Footer>
      </Modal>


    </div>
  )
}

export default UserFormInsert;


