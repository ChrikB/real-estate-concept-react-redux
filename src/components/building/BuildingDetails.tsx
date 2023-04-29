
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';

import DatePicker  from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { MapContainer, TileLayer, useMap, useMapEvent,  Popup, Marker } from 'react-leaflet'

import { useRef, createRef, RefObject } from "react";
import { useState, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';

import { Building, Bundle }  from './types'

import { useNavigate } from 'react-router-dom';



function MapInteract(props: { markerPosition: any[] }){
  
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

  const map = useMap();

  useEffect(() => {
    if (props.markerPosition.length===0||!props.markerPosition[0]){
      return;
    }
    let intPos:any = [ parseFloat(props.markerPosition[0]), parseFloat(props.markerPosition[1]) ];
    setPosition(intPos);
    map.setView(intPos, 3); 

  }, [props.markerPosition])

  return (<Marker position={position}></Marker>);
}









function BuildingDetails(props: {buildingDataProp: Building|null}){

  require('./BuildingDetails.css');

  const dispatch: Function = useAppDispatch();

  const navigate = useNavigate();

  const publicPath = "./";// import.meta.env.BASE_URL

  const [allowedDates, setAllowedDates] = useState([]);

  const [startAvailabilityDate, setStartAvailabilityDate] = useState(null);

  const [endAvailabilityDate, setEndAvailabilityDate] = useState(null);

  const bundleStaticProps =  ['bundlePrice', 'duration', 'name', 'dates', 'days'];


  const onChangeAvailabilityRange = (dates:any) => {
    const [start, end] = dates;
    setStartAvailabilityDate(start);
    setEndAvailabilityDate(end);
  };



  const isValidHttpUrl = (str: string)=> {
    let url;
    try {
      url = new URL(str);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  };



  const getPath = (x: string)=>{
    /* means it is  base64 or blob */
    if (x.length>100 || /blob/i.test(x) || /base64/i.test(x) ){     
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
     // return new URL('./../' + x, import.meta.url).href;
      return new URL( publicPath + x, import.meta.url).href;
    }
  };


  
  const  calcBundleSavings = (bundle: any)=> {
    let pr = 1;
    if (props.buildingDataProp && props.buildingDataProp.pricePerDay) {
      pr = parseInt(props.buildingDataProp.pricePerDay.toString(), 10);
    }
    let originalPrice = pr * bundle.days; 
    let bundlePrice = bundle.bundlePrice;    
    let dif = originalPrice - bundlePrice;
    let discount = bundlePrice*100/originalPrice;   
    return Math.ceil(100 - discount);
  };



  const reformDate = (bundleDates: string[]) => {
    let d = bundleDates.map(function(x){ return new Date(x).toLocaleDateString() } );
    return d.join(' - ');
  };



  const filterBundleStaticProps = (bundle: any)=> {
    let allowed =  bundleStaticProps;
    let filtered = {};
    filtered = Object.keys(bundle)
      .filter(key => !allowed.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = bundle[key];
        return obj;
      }, {}); 
    return filtered;
  };


  useEffect(() => {

    if( /#bundles/.test(window.location.href) ){
      window.document.querySelector('#bundles-end')!.scrollIntoView({behavior: 'smooth'});
    }
  }, [])



  return(
    <div className="buildingDetails-component">
       { props.buildingDataProp && <h1 className="d-none text-capitalize" >{props.buildingDataProp.buildingName}</h1> }
      <div className="row">
        <div className="col-12 col-md-6">
        <Carousel className="m-auto">  
              { 
                props.buildingDataProp && 
                props.buildingDataProp.imgs.map( (img, index) => 
                  <Carousel.Item key={index}>
                      <style>button[aria-label="{'Slide '+(index+1)}"]{ '{background-size:cover;width:50px!important;height:50px!important;background-image: url('+getPath(img)+');  }'  }</style>
                      <div 
                        className="carousel-item-img-bg"
                        style={{ backgroundImage: 'url('+getPath(img)+')'}}
                      ></div> 
                  </Carousel.Item>
                )
              }
        </Carousel>

        </div>
        <div className="col-12 col-md-6">
          <div className="row g-0 text-start">

          {
            props.buildingDataProp && 

            <h2 className="ps-1 text-capitalize" >
              {props.buildingDataProp.buildingName}
            </h2>  
          }
            
          { props.buildingDataProp && 
            <a 
              role="button"
              onClick={ 
                (e)=> { 
                  if(props.buildingDataProp) { 
                    navigate( '/building/' + props.buildingDataProp.id   )
                  }
                }         
              }
              className="p-1 d-inline-block w-auto" 
            >
              Edit Post as Admin 
            </a>
          }

            <div className="mb-1 col-12 text-left">
              <label  className="form-label m-0 p-1 _fw-bold align-middle">Reviews</label>

              { props.buildingDataProp && props.buildingDataProp.rating &&  

                <div className="review-stars d-inline-block" >

                  { 
                    [1,2,3,4,5].map(  
                      (result: number , index: number)=> 
                        <svg 
                          fill={(  props.buildingDataProp && index < props.buildingDataProp.rating)?'#ffcd00':'transparent'} 
                          key={index} 
                          xmlns="http://www.w3.org/2000/svg" 
                          stroke="#979494" 
                          style= {{marginRight: '0.1rem'}}
                          width="16" 
                          height="16" 
                          className="bi bi-star-fill" 
                          viewBox="0 0 16 16"
                        >           
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                    )
                  }

                </div>

              }
            </div>

            { props.buildingDataProp && props.buildingDataProp.country &&
            <div 
              className="mb-1 col-12 text-left" 
            >
              <label  className="form-label m-0  p-1  fw-bold">Country</label>
              <span className="p-1">{props.buildingDataProp.country}</span>
            </div>
            }

            { props.buildingDataProp && props.buildingDataProp.size &&
            <div 
              className="mb-1 col-12 text-left" 
            >
              <label  className="form-label m-0  p-1  fw-bold">Size</label>
              <span className="p-1">{props.buildingDataProp.size}</span>
            </div>
            }

            { props.buildingDataProp && (props.buildingDataProp.floor||props.buildingDataProp.floor===0) &&
            <div 
              className="mb-1 col-12 text-left" 
            >
              <label  className="form-label m-0  p-1  fw-bold">Floor</label>
              <span className="p-1">{props.buildingDataProp.floor}</span>
            </div>
            }

            { props.buildingDataProp && props.buildingDataProp.rooms &&
            <div 
              className="mb-1 col-12 text-left" 
            >
              <label  className="form-label m-0  p-1  fw-bold">Rooms</label>
              <span className="p-1">{props.buildingDataProp.rooms}</span>
            </div>
            }

            { props.buildingDataProp && props.buildingDataProp.pricePerDay &&
            <div 
              className="mb-1 col-12 text-left" 
            >
              <label  className="form-label m-0  p-1  fw-bold">Price(per day)</label>
              <span className="p-2">{props.buildingDataProp.pricePerDay.toLocaleString()}$</span>
            </div>
            }
            <div className="mb-1 col-12 text-center">
              <button className="btn btn-success demo-disabled">Book now</button>
            </div>


          </div>
        </div>


      </div>
      <div className="row availability-row">

        <div className="col-12 mt-5 mb-3"><hr className="m-auto w-75" /></div>
        <div className="col-12 col-md-6 datepicker-col">
            <h5 
              className={ " mt-3 mb-3 " + ((!props.buildingDataProp||!props.buildingDataProp.availability)?'opacity-50':'') }
            >
              Available Dates
            </h5>

          { !props.buildingDataProp||!props.buildingDataProp.availability && 
            <div 
              className="d-flex h-75 align-items-center" 
              style={{minHeight: '200px'}}
            >
              <h3 className="m-auto text-danger shadowred">Unavailable</h3>
            </div>
          }

          { props.buildingDataProp && props.buildingDataProp.availability &&   Array.isArray(props.buildingDataProp.availability)  &&       
            <DatePicker 
            
            renderCustomHeader={({
              monthDate,
              customHeaderCount,
              decreaseMonth,
              increaseMonth,
            }) => (
              <div>
                <button
                  aria-label="Previous Month"
                  className={
                    "react-datepicker__navigation react-datepicker__navigation--previous"
                  }
                  style={ customHeaderCount === 1 ? { visibility: "hidden" } : { visibility: "visible" } }
                  onClick={decreaseMonth}
                >
                  <span
                    className={
                      "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                    }
                  >
                    {"<"}
                  </span>
                </button>
                <span className="react-datepicker__current-month">
                  {monthDate.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  aria-label="Next Month"
                  className={
                    "react-datepicker__navigation react-datepicker__navigation--next"
                  }
                  style={ customHeaderCount === 0 ? { visibility: "hidden" } : { visibility: "visible" }  }
                  onClick={increaseMonth}
                >
                  <span
                    className={
                      "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                    }
                  >
                    {">"}
                  </span>
                </button>
              </div>
            )}

              selected={startAvailabilityDate}
              startDate={startAvailabilityDate}
              endDate={endAvailabilityDate}
              onChange={onChangeAvailabilityRange} 
              dateFormat= "YYYY-MM-DD"
              selectsRange
              monthsShown={2} 
              highlightDates={props.buildingDataProp.availability.map( (dateStr: any , index: number)=> new Date(dateStr)  )}
              includeDates={  props.buildingDataProp.availability.length>0? props.buildingDataProp.availability.map( (dateStr: any , index: number)=> new Date(dateStr)  ): undefined  }
              inline
            />
          }    

        </div>
        <div className="col-12 col-md-6 map-col">  
          <h5 className="mt-3 mb-3">Location</h5>
          <div className="map-cont mt-3 m-auto">

            {
            <MapContainer className="m-auto h-100" id="map" center={[51.505, -0.09]} zoom={3} maxZoom={19} scrollWheelZoom={false}>
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                           
                            <MapInteract 
                              markerPosition={[props.buildingDataProp?.map.lat, props.buildingDataProp?.map.lng]}
                            ></MapInteract>
            </MapContainer>
            }

          </div>
        </div>   

      </div>
      <div className="row bundle-row"  id="bundles">

        { props.buildingDataProp && props.buildingDataProp.bundles && props.buildingDataProp.bundles.length > 0 && 

                          
          props.buildingDataProp.bundles.map(  
            (bundle: Bundle , index: number)=> 
            <div 
             
              className="col text-start mt-5"
              key={index}
            >
              <div className="bundle mt-3 mb-3 text-center mx-auto">
                <h5>{bundle.name||'Unnamed'}</h5>
                <p className="d-inline-block p-1 fw-bold card-savingsMessage">
                    Save <span className="fw-bold save-percent">{calcBundleSavings(bundle)}</span>%
                </p>
                <div className="p-2">
                    <button className="btn btn-success demo-disabled">Select</button>
                </div>
                <div>
                    <ul className="list-group list-group-flush">
                      { 
                        Object.keys(filterBundleStaticProps(bundle)).map( 
                          (bundleProp: string, indexKey: number) =>(

                            <li className="list-group-item" key={indexKey}>
                              <span className="fw-bold text-capitalize d-inline-block">{bundleProp}</span>
                              {
                                (bundle[bundleProp as keyof Bundle]===true||bundle[bundleProp as keyof Bundle]==='true') && 
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="26" 
                                  height="26" 
                                  fill="currentColor" 
                                  className="bi bi-check position-absolute d-inline-block" 
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>                             
                              }
                              {
                                (bundle[bundleProp as keyof Bundle]===false||bundle[bundleProp as keyof Bundle]==='false') && 
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="26" 
                                  height="26" 
                                  fill="currentColor" 
                                  className="bi  bi-x  position-absolute d-inline-block" 
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>                             
                              }                            
                            </li>
                          )
                        )
                      }
                    </ul>
                </div>                
                { bundle.dates.length>0 &&
                <div className="bundle-dates p-2">
                    <label className="fw-bold d-none">Available for</label>
                    <span className="p-2 d-block fw-bold text-decoration-underline text-success">{ reformDate(bundle.dates) }</span>
                </div>
                }
                { bundle.days &&
                <div className="bundle-duration p-2" >
                    <label className="fw-bold">Duration:</label>
                    <span className="p-2">{bundle.days} days</span>
                </div>
                }
                { bundle.bundlePrice !== null && bundle.bundlePrice > 0 &&
                <div className="bundle-price p-2">
                    <h5>{bundle.bundlePrice} $</h5>
                </div>   
                }             





              </div> 
            </div>

        )
                          
        }
      </div><div id="bundles-end"></div>    

    </div>
  );
}

export default BuildingDetails;
