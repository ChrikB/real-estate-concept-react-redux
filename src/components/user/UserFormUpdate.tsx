
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//import { useRef } from "react";
import { useState } from 'react';

import  UserFormData from './../../components/user/UserFormData'

import {  useAppDispatch } from '../../app/hooks';

import { User } from './types'
import { 
  requestUpdateUser
} from './userSlice';



function UserFormUpdate(props: {userDataProp: User} ){

  require('./UserFormUpdate.css');


  const dispatch: Function = useAppDispatch();

  /*-- const [formData, setFormData] = useState({id:null}); */     
  const [formData, setFormData] = useState<User>(props.userDataProp);
/*
  const modalbtn = useRef(null);

  const modalBody = useRef(null);
*/
  const [show, setShow] = useState(false);/* modal */

  const [modalMessage, setModalMessage] = useState('');/* modal */

  const [invalids, setInvalids] = useState('');/* invalids */
 
  const onFormDataUpdated= (formData: User) => {

    setFormData(formData);
  }



  const  update = () => { 

    let invalids = dispatch(requestUpdateUser(formData));  
    
    if (!invalids.ALL) {    

      setInvalids(invalids);

      let invalidsLen: number = Object.keys(invalids).length;

      if (invalidsLen === 0  || (invalidsLen === 1 && invalids.hasOwnProperty('ALL')) ) {

        setModalMessage("User updated successfully");

        setShow(true); 
      }

    } else {
      
      setModalMessage("Form cannot be empty");

      setShow(true);
    }
  }

  return (  
    <div>
      <form className="UserFormUpdate-component">
        <UserFormData 
            formDataChanged={onFormDataUpdated}
            invalids={{}} 
            formDataProp={props.userDataProp}
        />   
        <button 
          className="btn btn-primary"
          type="button" 
          onClick={ (e)=>  update()  }
        >Update</button>
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
  );

}



export default UserFormUpdate;





