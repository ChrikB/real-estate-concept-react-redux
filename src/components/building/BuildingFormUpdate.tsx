
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useRef } from "react";
import { useState } from 'react';
import { useNavigate  } from "react-router-dom";

import { useSearchParams } from "react-router-dom";

import  BuildingFormData from './BuildingFormData'

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import { Building } from './types'

import { 
  requestUpdateBuilding,
  requestRemoveBuilding
} from './buildingSlice';

import { User }  from './../user/types'


function BuildingFormUpdate( props: { buildingDataProp: Building } ){

  require('./BuildingFormUpdate.css');

  let [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const dispatch: Function = useAppDispatch();
  
  const [formData, setFormData] = useState<Building|null|undefined>(null);

  const [show, setShow] = useState(false);/* modal */

  const [modalMessage, setModalMessage] = useState('');/* modal */
  
  const [leavePageAfter, setLeavePageAfter ] = useState(false);/* modal */

  const [invalids, setInvalids] = useState({});/* invalids */

  const [assignTo, setAssignTo] = useState<number|null>(null);



  const lastentry = useRef<HTMLDivElement>(null!);       
/*
  const lastEntryEmail: {[current:string]:any} = useRef(null);

  const modalbtn = useRef<HTMLButtonElement>(null!);

  const modalBody = useRef<HTMLDivElement>(null!); 
*/
  const currentUsers = useAppSelector(store => store.user.users);



  const onFormDataUpdated = (formData: Building ) => {  

    setFormData(formData);
    setAssignTo(formData.assignTo);

  }



  const  remove = () => {

    if (!formData) {
      return;
    } 

    let buildingData = {...formData};

    if(formData && assignTo){ 
      buildingData['assignTo'] = assignTo;
    }

    let errorFound = dispatch(requestRemoveBuilding(buildingData)); 

    let errorFoundLen: number = Object.keys(errorFound).length;

    if (errorFoundLen === 0  || (errorFoundLen === 1 && errorFound.hasOwnProperty('ALL')) ) {

      setLeavePageAfter(true);

      setModalMessage("Building deleted successfully");

      setShow(true); 

    } else {

      setModalMessage(" Error: " + errorFound.assignTo );

      setShow(true); 
    }

  }



  const  update = () => {

    if (!formData) {
      return;
    } 

    let buildingData = {...formData};

    if(formData && assignTo){ 

      buildingData['assignTo'] = assignTo;
    }

    let invalids = dispatch(requestUpdateBuilding(buildingData));  
      
    if (!invalids.ALL) {    

      setInvalids(invalids);

      let invalidsLen: number = Object.keys(invalids).length;

      if (invalidsLen === 0  || (invalidsLen === 1 && invalids.hasOwnProperty('ALL')) ) {

        setModalMessage("User Building updated successfully");

        setShow(true); 

      }

    } else {

      setModalMessage("Form cannot be empty");

      setShow(true);

    }
  }



  return (
    <div>
      
      <form className="BuildingFormInsert-component">

          <BuildingFormData 
            formDataChanged={onFormDataUpdated}
            invalids={invalids}
            formDataProp={props.buildingDataProp}
          />   

          <div className="m-auto w-25 pt-2 pb-4" style={{ minWidth:"200px" }}>
            <label className="form-label fw-bold">Assing Building To</label>
            <select  
              className="form-select  text-center"  
              onChange={(e)=> setAssignTo(parseInt(e.target.value,10)) }
              value={assignTo?.toString()}
            >
              { 
                currentUsers.map( (user: User, index: number) =>
                  <option key={index} value={user.id?.toString()}>{user.username}</option>
                )
              }
  
            </select>
          </div>

          <button 
            type="button" 
            className="btn btn-primary m-1" 
            onClick={ (e)=>  update()  }
          >Update Building entry</button>

          <button 
            type="button" 
            className="btn btn-danger m-1" 
            onClick={ (e)=>  remove()  }
          >Remove Building</button>

          <div className="lastentry" ref={lastentry} ></div>
      </form>
  
      <Modal
          show={show}
          aria-labelledby="custom-modal-styling-title"
        >
          <Modal.Body>
            <p>
             {modalMessage}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={(e)=>  {
                  setShow(false);
                  if(leavePageAfter===true){
                    navigate({pathname:'buildings'});
                  }
                } 
              }
            >Close</Button>
          </Modal.Footer>
      </Modal>
    </div>
    );




}


export default BuildingFormUpdate;
