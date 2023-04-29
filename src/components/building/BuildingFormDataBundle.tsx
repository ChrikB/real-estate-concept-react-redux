
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './../../app/hooks';
import { RootState, AppThunk } from './../../app/store';

import {BuildingState, BuildingInvalidForms, Building, Bundle } from './types'

import DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function BuildingFormDataBundle( 
    props: 
    {   addbtn: Boolean|undefined, 
        removable: Boolean ,  
        addBundle: Function,  
        deleteBundle: Function, 
        updateBundle?: Function, 
        index: number, 
        bundleProps: any, 
        invalids?: any  
    }  
){

    require('./BuildingFormDataBundle.css');

    const [bundle, setBundle] = useState<Bundle>();


    const updateBundle = (e: any, prop: string)=>{
        
        let newState: any = {};
        newState[prop  as keyof Bundle] = e.target.value; 
        
        setBundle((bb) => {
            let bbb = {...bb, ...newState};
            return bbb;
        });
        

        if (props.updateBundle) {
            let bbba:any = {};
            bbba[prop as keyof Bundle] = e.target.value; 
            props.updateBundle({...props.bundleProps, ...bbba }, props.index);
        }    

    };



    const hasInvalidBundle = ()=> {
        return  props.invalids && props.invalids.bundles && props.invalids.bundles.key==props.index ? true:false;
    }


    useEffect(() => {
        
        setBundle(props.bundleProps);
             
    }, [props.bundleProps])


    /* datepicker handle */
    const onChangeBundleRange = (dates:any) => { 

        const [start, end] = dates;
        let newDates:any = [];
        if (start) { 
            newDates[0] = start;
        }
        if (end) { 
            newDates[1] = end;
        }
        updateBundle({target: { value: newDates }}, "dates");

    };



    return(
<div className={"buildingFormDataBundle-component pt-2 pb-2 " + ((!props.removable)?'emptybundle':'')}>
        
        <div className="mb-3">
            <div className="form-check align-items-center d-flex justify-content-center">
                <input 
                    className="form-check-input" 
                    type="checkbox"  
                    id={'flexCheckDefaultBreakfast' + props.index}
                    checked={ (bundle&&bundle.breakfast) || false }
                    onChange={(evt) => updateBundle({target: { value: evt.target.checked }}, "breakfast")} 
                />
                <label className="form-check-label  ms-1" htmlFor={'flexCheckDefaultBreakfast' + props.index}>Breakfast</label>
            </div>
            <div className="form-check align-items-center d-flex justify-content-center">
                <input className="form-check-input" 
                    type="checkbox" 
                    id={'flexCheckCheckedDinner' + props.index}
                    checked={ (bundle&&bundle.dinner) || false }
                    onChange={(evt) => updateBundle({target: { value: evt.target.checked }}, "dinner")}
                 />
                 <label 
                    className="form-check-label  ms-1" 
                    htmlFor={'flexCheckCheckedDinner'+ props.index}
                >Dinner</label>
            </div>
            <div className="form-check align-items-center d-flex justify-content-center">
                <input className="form-check-input" 
                    type="checkbox" 
                    id={'flexCheckCheckedLunch' + props.index}
                    checked={ (bundle&&bundle.lunch) || false }
                    onChange={(evt) => updateBundle({target: { value: evt.target.checked }}, "lunch")}
                />
                <label 
                    className="form-check-label ms-1" 
                    htmlFor={'flexCheckCheckedLunch'+ props.index}
                >Lunch</label>
            </div>
            <div className="form-check  align-items-center d-flex justify-content-center">
                <input className="form-check-input" 
                    type="checkbox" 
                    id={'flexCheckCheckedSelfCatering' + props.index}  
                    checked={ (bundle&&bundle.selfCatering) || false }
                    onChange={(evt) => updateBundle({target: { value:evt.target.checked }} ,"selfCatering")}
                 />
                <label 
                    className="form-check-label  ms-1" 
                    htmlFor={'flexCheckCheckedSelfCatering' + props.index}
                >Self Catering</label>
            </div>
            <div className="form-check   align-items-center d-flex justify-content-center mb-3">
                <input className="form-check-input" 
                    type="checkbox" 
                    id={'flexCheckCheckedWifi' + props.index}  
                    checked={ (bundle&&bundle.wifi) || false }
                    onChange={(evt) => updateBundle({target: { value:evt.target.checked }},"wifi")}
                />
                <label 
                    className="form-check-label  ms-1" 
                    htmlFor= {'flexCheckCheckedWifi' + props.index}
                >wifi</label>
            </div> 
            <div className="input-group mb-3 ">
                <span 
                className={"input-group-text " + ((hasInvalidBundle())?'is-invalid':'') } 
                id="duration">Days</span>
                <input 
                    type="number" 
                    className="form-control text-center" 
                    placeholder="Days" 
                    aria-label="how many days" 
                    aria-describedby="duration"  
                    value={ (bundle&&bundle.days)?bundle.days:0 } 
                    onChange={(evt) => updateBundle(evt, "days")}
                />  
                { hasInvalidBundle() && props.invalids.bundles.daystext &&
                <div className="invalid-tooltip">
                    { props.invalids.bundles.daystext }
                </div>
                }           
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Dates</span>

                <DatePicker  
                    className="form-control text-center" 
                    onChange={onChangeBundleRange}
                    shouldCloseOnSelect={false}
                    selectsRange={true}
                    startDate={ (bundle&&bundle.dates&&bundle.dates[0]?new Date(bundle.dates[0]):undefined) }
                    endDate={ (bundle&&bundle.dates[1]?new Date(bundle.dates[1]):undefined) }
                />

            </div>
            <div className=" input-group mb-3 ">
                <span 
                    className={"input-group-text " + ((hasInvalidBundle())?'is-invalid':'') }
                    id="bundlePrice" 
                >Bundle price</span>
                <input 
                    placeholder="" 
                    aria-label="BundlePrice" 
                    aria-describedby="bundlePrice"
                    type="text" 
                    className="form-control text-center" 
                    value={ (bundle&&bundle.bundlePrice)?bundle.bundlePrice : "" } 
                    onChange={(evt) => updateBundle(evt, "bundlePrice")}
                />
                { hasInvalidBundle() && props.invalids.bundles.text &&
                <div className="invalid-tooltip">
                    { props.invalids.bundles.text }
                </div>
                }
            </div> 
            <div className="input-group mb-3">
                <span className="input-group-text" id="bundleName">Name</span>
                <input 
                    placeholder="Summer Offer 2023" 
                    aria-label="bundleName" 
                    aria-describedby="bundle name"
                    type="text" 
                    className="form-control text-center" 
                    value={ (bundle&&bundle.name)?bundle.name : "" }  
                    onChange={(evt) => updateBundle(evt, "name")}
                />
            </div>                         
        </div>

       { (props.addbtn==true) && 
        <button 
           role="button" 
           className="btn btn-sm btn-primary m-1"  
           type="button"    
           onClick={(evt) => props.addBundle(bundle)}
        >Add</button>
       }
       { (props.removable==true) && 
        <button 
           role="button" 
           className="btn btn-sm btn-danger m-1"   
           type="button"    
           onClick={(evt) => props.deleteBundle(bundle, props.index)}
        >Delete</button>
       }   

</div>
    );
}


export default BuildingFormDataBundle;
