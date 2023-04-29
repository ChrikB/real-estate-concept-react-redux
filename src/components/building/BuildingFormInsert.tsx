
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useRef, createRef, RefObject } from "react";
import { useState, useEffect } from 'react';

import  BuildingFormData from './BuildingFormData'

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import { Building }  from './types'
import { User }  from './../user/types'
import { 
  requestCreateBuilding
} from './buildingSlice';



function BuildingFormInsert(){

  require('./BuildingFormInsert.css');
  

  const dispatch: Function = useAppDispatch();

  const [formData, setFormData] = useState<Building|null|undefined>(null);

  const [show, setShow] = useState(false);/* modal */

  const [modalMessage, setModalMessage] = useState('');/* modal */

  const [invalids, setInvalids] = useState({});/* invalids */

  const [assignTo, setAssignTo] = useState<number|undefined>(undefined);

  const lastEntryEmail: {[current:string]:any} = useRef(null);

  const lastentry = useRef<HTMLDivElement>(null!);  

  const modalbtn = useRef<HTMLButtonElement>(null!);

  const modalBody = useRef<HTMLDivElement>(null!);  


  const currentUsers = useAppSelector(store => store.user.users);
  
  const currentBuildings = useAppSelector(store => store.building.buildings);
  


  const onFormDataUpdated = (formData: Building ) => {

    setFormData(formData);

    lastentry.current.innerHTML = '';

  }



  const add = () => {

    if(formData && assignTo){ 
      formData['assignTo'] = assignTo;
    }

    if(formData && !formData.assignTo) {
      alert('NO ASSIGN' +  JSON.stringify(formData.assignTo));
    }

    let invalids = dispatch(requestCreateBuilding(formData));  
    
    if (!invalids.ALL) {  

      setInvalids(invalids);

      let invalidsLen: number = Object.keys(invalids).length;

      if (invalidsLen === 0  || (invalidsLen === 1 && invalids.hasOwnProperty('ALL')) ) {

        setModalMessage("Entry inserted successfully");
        setShow(true); 

        lastentry.current.innerHTML = 'Last entry : ' + formData?.buildingName;

        lastEntryEmail.current = formData?.buildingName!;

      }

    } else {

      setModalMessage("Form cannot be empty");
      setShow(true);

    }

  };



  useEffect(() => {

      setAssignTo(  (currentUsers.length>0)? 3 : 0 ) ;  

  }, [currentUsers]); 


  return (
  <div>

    <form className="BuildingFormInsert-component">

        <BuildingFormData 
          formDataChanged={onFormDataUpdated}
          invalids={invalids}
        />   

        <div className="m-auto w-25 pt-2 pb-4" style={ { minWidth: "200px" } }>
          <label className="form-label fw-bold">Assing Building To{ (currentUsers.length>0)? 1 : 0 }</label>
          <select  
            className="form-select  text-center"  
            onChange={(e)=> setAssignTo(parseInt(e.target.value,10)) }
            value={ assignTo }
          >
            { 
              currentUsers.map( 
                (user: User, index: number) =>
                  <option 
                    key={index} 
                    value={user.id?.toString()} 
                  >{user.username}</option>
              )
            }

          </select>
        </div>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={ (e)=>  add()  }
        >Add Building entry</button>
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
          <Button variant="secondary" onClick={(e)=> { setShow(false); } }>Close</Button>
        </Modal.Footer>
    </Modal>
  </div>
  );
}

export default BuildingFormInsert;
