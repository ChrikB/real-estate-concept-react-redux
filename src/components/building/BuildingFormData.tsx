import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Tabs';

import DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { MapContainer, TileLayer, useMap, useMapEvent,  Popup, Marker } from 'react-leaflet'

import { useRef, createRef, RefObject } from "react";
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './../../app/hooks';
import { RootState, AppThunk } from './../../app/store';

import {BuildingState, BuildingInvalidForms, Building, Country, Bundle } from './types'

import BuildingFormDataBundle from './BuildingFormDataBundle'



declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      lat?: string|number;
      lon?: string|number;
      autoComplete?: string;
      value?:string|number|boolean|undefined|null|any;
    }
}

  
/* leaflet's functional component */
function MapInteract(props: { markerPosition: any, findMapCountryName: Function, countrySelectedIndex: Number, setCountrySelectedIndex: Function, updateBuildingData: Function }){

  let countries: any = useAppSelector( (state): RootState => state.user.countries);

  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

  const map = useMapEvent('click', (e) => {   

    let countryObjFound:any = props.findMapCountryName(e.latlng.lat, e.latlng.lng);

    if (countryObjFound /*&& countryObjFound.index!= props.countrySelectedIndex */) {

       props.setCountrySelectedIndex(countryObjFound.index);

       let countryMapObj = countries[countryObjFound.index];
       props.updateBuildingData(  { target: { value: countryMapObj.long_name } }  , 'country');

    }
    
    props.updateBuildingData({
      target: {
        value: {
          lat: e.latlng.lat, 
          lng: e.latlng.lng 
        } 
      }
    }, "map");

    setPosition([ e.latlng.lat, e.latlng.lng]);

  });


  useEffect(() => {
 
    setPosition(props.markerPosition);
    map.setView(props.markerPosition, 3);

  }, [props.markerPosition])


  return (<Marker position={position}></Marker>);
}


  




function BuildingFormData(props: {formDataChanged: Function, formDataProp?: Building, invalids: BuildingInvalidForms}){

    require('./BuildingFormData.css');

    const dispatch: Function = useAppDispatch();

    const gallery = useRef<HTMLDivElement>(null!); 

    let countries: any = useAppSelector( (state): RootState => state.user.countries);

    let defaults = {
        d: {
            username: "",
            buildingName: "",
            region: "",
            country: "CANADA",
            countryMapObj:"",
            mapLat: null,
            map: {
              lat: null,
              lng: null
            },
            size: "",
            floor: "",
            rooms: "",
            pricePerDay: "",
            availability: "",
            imgs: Array(),
            bundles: Array()
        }
    };

    const [d, setD] = useState({...defaults.d});

    const [markerPosition, setMarkerPosition] = useState<[number, number]> ([51.505, -0.09]);

    const [countrySelectedIndex, setCountrySelectedIndex ] = useState(172);

    const [isAvailable, setIsAvailable] = useState(false);

    const [selectedDates, setSelectedDates] = useState<Array<Date>>([]);

    const [startAvailabilityDate, setStartAvailabilityDate] = useState(null);

    const [endAvailabilityDate, setEndAvailabilityDate] = useState(null);

    const [bundlez, setBundle] = useState<any>({

      emptyBundle: true,
      name: 'Bundle Offer',
      dinner: true,
      breakfast: true,
      lunch: false,
      selfCatering: false,
      wifi: false,
      bundlePrice: null,
      days: null,
      dates: []

    });



    const updateBuildingData = (e: any, buildingProp: string) => {  
      let newState: any = {};
      newState[buildingProp  as keyof Building] = e.target.value;  
                                                                       
      setD((dd) => {
        let ddd = {...dd, ...newState};
        return ddd;
      });

    }

    useEffect(() => {
 
      props.formDataChanged(d);
  
    }, [d])



    



    useEffect(() => { 
      
      if(props.formDataProp){  

        setD((dd:any) => {

          /* update country select and map marker position */
          let key = getCountryIndexByName(props.formDataProp); 
          if(key){
            setCountrySelectedIndex(key);
            if (props.formDataProp && props.formDataProp.map && props.formDataProp.map.lat && props.formDataProp.map.lng){
              updateLeafMap(props.formDataProp.map, true);
            }
          }
          /* updateAvailability */
          
          if (dd.availability||dd.availability==='true') {  

            setIsAvailable(true);  

            if (Array.isArray(dd.availability) ) {

              setSelectedDates( dd.availability  );  
            }
            
          } else {
            setIsAvailable(false); 
          }

          let ddd = {...dd,...props.formDataProp};  
         
          return ddd;
        });

      }

    }, [props.formDataProp]);





    const findMapCountryName = (lat: number, lng: number)=>{

      let index=0;

      const normalizeDegrees = (v: number) => v < 0 ? 360 + v % 360 : v % 360;

      for (let countryObj of countries) {
         if ( countryObj.ne_lat  > lat 
            && countryObj.sw_lat < lat 
            && normalizeDegrees(lng - countryObj.sw_lng) < normalizeDegrees(countryObj.ne_lng - countryObj.sw_lng)
          )
         {
            return {countryObj: countryObj, index: index};
         }
         index++
      }
    };

  
    const updateLeafMap = (countryOption: any, setView: any)=>{  
      if (!countryOption||!countryOption.lat||!countryOption.lng){
        return;
      }
      let latC = countryOption.lat;
      let lngC = countryOption.lng;
      setMarkerPosition([latC, lngC]); 
    };


    const hasInvalidsProperties = () =>{
        if ( props.invalids && (props.invalids.size||props.invalids.floor||props.invalids.rooms||props.invalids.country)  ){
          return true;
        }
        return false;
    };


    const hasInvalidsPhotos = () =>{
        if ( props.invalids && (props.invalids.imgs)  ){
          return true;
        }
        return false;
    };



    const hasInvalidsBundles = () =>{
        if ( props.invalids && (props.invalids.bundles)  ){
          return true;
        }
        return false;
    };



    const isValidHttpUrl = (str:string)=>{
      let url;
      try {
        url = new URL(str);
      } catch (_) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    };


    const publicPath = "./";
    const getPath = (x:string)=>{
      if (x.length>100 || /blob/i.test(x) || /base64/i.test(x) ){
        /* means it is  base64 or blob */
        return x;
      }
      /* means that img path is http */
      if ( isValidHttpUrl(x) ) {
        return x;
      }
      return publicPath + x;
      /* otherwise its a string path */
      if ( process.env.NODE_ENV === 'development' ) {  
        return new URL('./../../' + x, import.meta.url).href
      }else{
        return new URL( publicPath + x, import.meta.url).href;
      }
    };



    const imgUpload = (event: any) => { 

      if(!event) {
        return;
      }
      let evTarget = event.target;
      if (evTarget && evTarget.files && evTarget.files[0]) {
 
          let img:HTMLImageElement = document.createElement('img');
          img.onload = () => { 
              let newArr = [...d.imgs];
              newArr.push(img.src);
              updateBuildingData({target: {value: newArr }}, "imgs");
          }
          img.setAttribute('class', 'dashboard dashboard-building-thumb')
          img.src = URL.createObjectURL(evTarget.files[0]); 
      }
    
    };



    const deleteBuildingImg= (index: number) => { 
      let newArr = [...d.imgs];
      newArr.splice(index, 1);
      updateBuildingData({target: {value: newArr }}, "imgs");
      //d.imgs.splice(index, 1);
    };







    const updateCountryIndex = (ev: any) => {

      let newValue = ev.target.value;

      if(newValue||newValue===0) {

        let countryMapObj = countries[newValue];
        setCountrySelectedIndex(newValue);
        updateBuildingData(  { target: { value: countryMapObj.long_name } }  , 'country');

        updateBuildingData({
          target: {
            value: {
              lat: countryMapObj.center_lat, 
              lng: countryMapObj.center_lng 
            } 
          }
        }, "map");

        updateLeafMap({lat: countryMapObj.center_lat,lng: countryMapObj.center_lng }, true);
      }

    };



    const getCountryIndexByName = (formData: (Building|any) ) => {
      let len = countries.length;
      for (let i =0; i< len; i++) {
        if(countries[i].long_name=== formData.country){
          return i;
        }
      }
    };



    const addBundle = (bundle: Bundle) =>{

      if (d.bundles.length>2) {
        alert('max 3');
        return;
      }
      let newBundle: Bundle = JSON.parse(JSON.stringify(bundle));
      if (newBundle.emptyBundle) { 
        /* remove the temporary property emptyBundle. It was acting like empty form */
        delete newBundle.emptyBundle; 
      }

      let newBundles = [...d.bundles];
      newBundles.push(newBundle);

      updateBuildingData({target: {value: newBundles }}, "bundles");

    };



    const deleteBundle = (bundle: Bundle , index: number) =>{

      let newBundles = [...d.bundles];

      newBundles.splice(index, 1);

      updateBuildingData({target: {value: newBundles }}, "bundles");

    };



    const updateBundle = (bundle: Bundle, index: number) => {

      let newBundles = [...d.bundles];

      newBundles[index] = {...bundle};      

      updateBuildingData({target: {value: newBundles }}, "bundles");

    };




    const onChangeAvailabilityRange = (date:any) => { 
   
      if (selectedDates.includes(date.getTime())) { 

          let k = selectedDates.findIndex((da) => da === date.getTime());
          let mm = [...selectedDates];
          mm.splice(k, 1);

          setSelectedDates( mm  );  

      } else {
  
          let mm = [...selectedDates]; 
          mm.push(date.getTime());

          setSelectedDates( mm  );

      }
    };



    const switchAvail= (e: any) => { 
      if(e.target.value ===true||e.target.value ==='true'){
        updateBuildingData({target: {value: true}}, "availability");   
        setIsAvailable(true);
      }else { 
        updateBuildingData({target: {value: false}}, "availability");   
        setIsAvailable(false);
      }
    };

    

    useEffect(() => {

      if (d.availability) {
        updateBuildingData({target: {value: selectedDates }}, "availability");
      }
 
    }, [selectedDates]);



    useEffect(() => {
 
      if (!d.availability) {
        setIsAvailable(false);
        setSelectedDates([]);
      }
      if (d.availability || Array.isArray(d.availability) ) {
        setIsAvailable(true);
      }   

    }, [d.availability]);



    return(

      <div className="buildingFormData-component">

        <div className="mb-5">
          <label 
            htmlFor="buildingName" 
            className="form-label fw-bold buildingName"
          >
            Building Name/type
          </label>
          <input 
            value={d.buildingName}
            type="text" 
            className={"form-control " + ((props.invalids.buildingName)?'is-invalid':'') } 
            id="buildingName" 
            aria-describedby="buildingNameHelp" 
            onChange={(evt) => updateBuildingData(evt, "buildingName")}
          />

          { props.invalids.buildingName && 
          <div className="invalid-tooltip">
            {props.invalids.buildingName}
          </div>
          }

          <div id="buildingNameHelp" className="form-text"></div>
        </div>


        <Tabs
          defaultActiveKey="building-props-tab"
          id="fill-tab-example"
          className="mb-3"
          fill
        >

          
          <Tab eventKey="building-props-tab"  title="Info" tabClassName={hasInvalidsProperties()?'has-invalids':''}>
            <div className="mt-5 m-auto" style={{maxWidth: "460px"}}>
                <div className="row g-1">

                    <div className="mb-3 col-12  col-md-3">
                        <label htmlFor="size" className="form-label">Size</label>
                        <input 
                            value={d.size}
                            id="size" 
                            aria-describedby="sizeHelp"
                            type="number" 
                            className={" form-control " + ((props.invalids.size)?'is-invalid':'')  } 
                            onChange={(evt) => updateBuildingData(evt, "size")}
                        />

                        {props.invalids.size && 
                        <div className="invalid-tooltip" >{props.invalids.size}</div>
                        }
                        <div id="sizeHelp" className="form-text"><span style={{color: "#71b370"}}>*Square Meters</span></div>
                    </div>
                    <div className="mb-3 col-12 col-md-3">
                        <label htmlFor="floor" className="form-label">Floor</label>
                        <input 
                            value={d.floor}
                            id="floor" 
                            aria-describedby="floorHelp"
                            type="number" 
                            className={" form-control " + ((props.invalids.floor)?'is-invalid':'')  }    
                            onChange={(evt) => updateBuildingData(evt, "floor")}
                        />
                        {props.invalids.floor && 
                        <div className="invalid-tooltip" >{props.invalids.floor}</div>
                        }
                        <div id="floorHelp" className="form-text"></div>
                    </div> 
                    <div className="mb-3 col-12 col-md-3">
                        <label htmlFor="rooms" className="form-label">Rooms</label>
                        <input 
                            value={d.rooms}
                            id="rooms" 
                            aria-describedby="roomsHelp"
                            type="number" 
                            className={" form-control " + ((props.invalids.rooms)?'is-invalid':'')  }   
                            onChange={(evt) => updateBuildingData(evt, "rooms")}
                        />
                        {props.invalids.rooms && 
                        <div className="invalid-tooltip">{props.invalids.rooms}</div>
                        }
                        <div id="roomsHelp" className="form-text"></div>
                    </div> 
                    <div className="mb-3 col-12 col-md-3">
                        <label htmlFor="pricePerDay" className="form-label">Price/Day</label>
                        <input 
                            value={d.pricePerDay}
                            id="pricePerDay" 
                            aria-describedby="pricePerDayHelp"
                            type="number" 
                            className={" form-control " + ((props.invalids.pricePerDay)?'is-invalid':'')  }   
                            onChange={(evt) => updateBuildingData(evt, "pricePerDay")} 
                        />
                        {props.invalids.pricePerDay && 
                        <div className="invalid-tooltip" >{props.invalids.pricePerDay}</div>
                        }
                    </div> 
                    <div className="mb-3">
                        <div className="m-auto" style={{maxWidth: "460px"}}> 
                          <label htmlFor="country" className="form-label">Country</label>
                          <select                          
                            className={" form-select form-control " + ((props.invalids.country)?'is-invalid':'') }    
                            aria-label="Default select example" 
                            id="exampleCheck1"
                            value={countrySelectedIndex}  
                            onChange={(evt) => updateCountryIndex(evt)}
                          >
                            {
                            countries.map( (option: Country, index:number)=> 
                            <option 
                                key={index} 
                                lon={option.center_lng} 
                                lat={option.center_lat}
                                value={index}
                            > {option.long_name}</option>
                            )
                            }     
                          </select>
                          {props.invalids.country && 
                          <div className="invalid-tooltip">{props.invalids.country}</div>
                          }
                          <span className="d-block fw-bold position-absolute country-note">Zoom in within country borders to place marker in certain region/street</span>
                        </div>
                        <div className="map-cont mt-5">
                          
                          <MapContainer className="m-auto w-100" id="map" center={[51.505, -0.09]} zoom={3} maxZoom={19} scrollWheelZoom={false}>
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                           
                            <MapInteract 
                              markerPosition={markerPosition}
                              updateBuildingData={updateBuildingData}
                              findMapCountryName={findMapCountryName} 
                              countrySelectedIndex={countrySelectedIndex} 
                              setCountrySelectedIndex={setCountrySelectedIndex} 
                            ></MapInteract>
                          </MapContainer>

                        </div>
                    </div>
                    <div className="mb-3 d-none">
                      <label htmlFor="pricePerDay" className="form-label">Price/Day</label>
                      <input 
                        type="number"
                        className="form-control"                         
                        id="pricePerDay" 
                        aria-describedby="pricePerDayHelp"
                        onChange={(evt) => updateBuildingData(evt, "pricePerDay")}
                      />
                      <div id="pricePerDayHelp" className="form-text"></div>
                    </div>
                    
                </div>{/*end of row*/}

            </div>

          </Tab>{/* end of tab-pane */}

          <Tab eventKey="building-photos-tab"  title="Photos"  tabClassName={hasInvalidsPhotos()?'has-invalids':''}>

            <div className="input-group mb-3 mt-5">
              <label className="input-group-text fw-bold border-0 bg-transparent" htmlFor="buildingImageInput">Upload</label>
              <input 
                id="buildingImageInput"           
                type="file" 
                className={" form-control " + ((props.invalids.imgs)?'is-invalid':'') }  
                onChange={(evt) => imgUpload(evt)}
              />
              <div className="invalid-tooltip">{props.invalids.imgs}</div>
            </div>
            <div className="row gallery" ref={gallery}>
              {
              d.imgs.map(
                (photo:any, index:number)=> 
                  <div className="col dashboard-building-thumb-slot" key={index}>
                    <div  
                      className="m-auto p-1 mt-2 mb-2 d-flex justify-content-center align-items-center  dashboard dashboard-building-thumb" 
                      style={{backgroundSize: 'cover', backgroundImage: 'url(' + getPath(photo) + ')'}}
                    >
                      <button 
                        type="button" 
                        className="btn-close p-2" 
                        aria-label="delete-img"  
                        onClick={(evt) => deleteBuildingImg(index)}
                      ></button>            
                    </div>
                  </div>
              )
              }
            </div>

          </Tab>

          <Tab eventKey="building-availability-tab" title="Availability" >

            <div style={{ maxWidth: "460px", margin: "auto" }}>
              <div className="mt-5 mb-3">
                <div className="mt-3 m-auto" style={{maxWidth: '200px'}}>
                  <h6 className="mt-4 mb-4">Availability</h6>
                  <div className="row">
                    <div className="col-6">
                      <input 
                        name="isavailable" 
                        id="success-outlined" 
                        autoComplete="off" 
                        checked={ (isAvailable===true || isAvailable.toString()==="true")?true:false }
                        type="radio" 
                        className="btn-check"
                        onChange={(evt) => switchAvail( {target: {value: true}} )  }  
                        value="true" 
                      />
                      <label className="btn btn-outline-success" htmlFor="success-outlined">Available</label>
                    </div>
                    <div className="col-6">
                      <input 
                        name="isavailable" 
                        id="danger-outlined" 
                        autoComplete="off" 
                        type="radio" 
                        className="btn-check"  
                        checked={ (!isAvailable || isAvailable.toString()==="false")?true:false }
                        onChange={(evt) => switchAvail( {target: {value: false}}) }    
                        value="false" 
                      />
                      <label className="btn btn-outline-danger" htmlFor="danger-outlined">Unavailable</label>
                    </div>
                  </div>
                </div>
                <div style={{'opacity': !isAvailable?0.3:1}}>
                  <h6 className="mt-4 mb-4">You can choose available dates</h6>   

      
            <DatePicker 
              placeholderText='Click to open calendar'
              disabled={!isAvailable?true:undefined} 
              selected={startAvailabilityDate}
              onChange={onChangeAvailabilityRange} 
              highlightDates={  selectedDates.map( (dateStr: any , index: number)=> new Date(dateStr))   }
              dateFormat= "YYYY-MM-DD"
              shouldCloseOnSelect={false}

            />
          
                </div>
              </div>
            </div>

          </Tab>
          <Tab eventKey="building-bundles-tab"      
            title={
              <>
                  {'Bundles'}
                  <span className="bundle-sum">{(d.bundles.length)}</span>
              </>
            }
            tabClassName={hasInvalidsBundles()?'has-invalids':''}
          >
            <h1 className="mt-5"></h1>
            <div className="row">
              <div className="col">
                <div className="fw-bold">Fill bundle form</div>
                <div className="bundle-cont mb-4">  

                  <BuildingFormDataBundle  
                    addbtn = {true}
                    removable={false}  
                    addBundle={addBundle} 
                    deleteBundle={deleteBundle}
                    index={1000}
                    bundleProps = {bundlez}
                    invalids={{}}
                  />


                </div>
              </div>
              {
              d.bundles.map(
                (bundleItem: Bundle, index: number)=> 
              <div className="col" key={index} >
                {bundleItem.name||'Unnamed'}
                <div className="bundle-cont mb-4">

                        <BuildingFormDataBundle 
                          invalids={props.invalids}
                          index={index}
                          addBundle={addBundle}                         
                          addbtn={false}  
                          removable= {true}
                          deleteBundle={deleteBundle}
                          updateBundle={updateBundle} 
                          bundleProps={bundleItem} 
                        />



                </div>
              </div>
              )
              }



            </div>
          </Tab>





        </Tabs>{/*</div>*/}{/* end of tab-content */}

        <div className="mb-3 d-none">
          <label htmlFor="region" className="form-label">Region (<span style={{color: 'red'}}>*</span>disabled for demo)</label>
          <input type="text" className="form-control" v-model="d.region" id="region" disabled />
        </div>

      </div>
    );
}

export default BuildingFormData;

