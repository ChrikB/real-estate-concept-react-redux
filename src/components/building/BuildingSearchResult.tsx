

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../app/hooks';

import {  Building }  from './types'



function BuildingSearchResult( props: { buildingSearchResult: any,  removeBuilding?: Function } ){
  
  require('./BuildingSearchResult.css');

  const dispatch: Function = useAppDispatch();

  const navigate = useNavigate();

  const publicPath = "./";// import.meta.env.BASE_URL



  const isValidHttpUrl = (str: string)=> {
    let url;
    try {
      url = new URL(str);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }



  const imgPath = (x: string) => {
    /* means it is  base64 or blob */
    if (x.length>100 || /blob/i.test(x) || /base64/i.test(x) ){      
      return x;
    }
    /* means that img path is http */
    if ( isValidHttpUrl(x) ) {
      return x;
    }
    /* means that img path is static file in folder */
    return publicPath + x;
  }

  const itHasBundles = ()=> {

    if( props.buildingSearchResult.bundles && props.buildingSearchResult.bundles.length>0){
      return true;
    }
    return false;
  };



  return (
    <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
    <div 
      className="buildingSearchResult-component" 
      onClick={
        (e)=>{
          e.preventDefault(); 
          navigate( '/buildings/' + props.buildingSearchResult.id)  
        }
      }
    >    
      <div className="row">

        <div className="col-12 text-start">
          <figure> 
            <div 
              className="building-thumb building-thumb-main m-auto" 
              style={{ backgroundImage: (props.buildingSearchResult.imgs&&props.buildingSearchResult.imgs.length>0)? 'url('+ imgPath(props.buildingSearchResult.imgs[0]) + ')':'' }}
            ></div>
            <figcaption></figcaption>
          </figure>
        </div>

        <div className="col-12 _text-start text-center">
<div className="d-inline-block text-center">
          <div 
            data-building="id" 
            className="building-id d-none"
          >
            { props.buildingSearchResult.id }
          </div>
          <div 
            data-building="availability" 
            className="building-availability"
          >
            { props.buildingSearchResult.availability?'Available':'Unavailable' }
          </div>
          <div 
            data-building="name" 
            className="building-name"
          >
            <span className="buildingNameSpan align-middle" >{ props.buildingSearchResult.buildingName }</span>
          </div>

        { props.buildingSearchResult && props.buildingSearchResult.rating &&  

          <div className="review-stars" >

            { 
              [1,2,3,4,5].map(  
                (result: number , index: number)=> 
                  <svg 
                    fill={( index < props.buildingSearchResult.rating)?'#ffcd00':'transparent'} 
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

          <div>
            { 
            props.buildingSearchResult.region &&
            <span 
              data-building="region"   
              className="building-region"
            >
              { props.buildingSearchResult.region }/
            </span>
            }
            <span 
              data-building="country"  
              className="building-country"
            >
              { props.buildingSearchResult.country }
            </span>
          </div>
          <div className="row g-3 align-items-center justify-content-center">
            <div className="col-auto">
              <div className="label building-size-label">Size:</div>
            </div>
            <div className="col-auto">  
              <div 
                data-building="size" 
                className="building-size"
              >
                { props.buildingSearchResult.size }
                <span className="building-size-unit p-1">Sq.M</span>
              </div>   
            </div>
          </div>         
          <div className="row g-3 align-items-center justify-content-center">
            <div className="col-auto">
              <div className="label building-floor-label">Floor:</div>
            </div>
            <div className="col-auto">  
              <div 
                data-building="floor" 
                className="building-floor"
              >
                { props.buildingSearchResult.floor }
              </div>   
            </div>
          </div>


          <div 
            data-building="price"   
            className="building-price align-items-center"
          >
            <span>${ props.buildingSearchResult.pricePerDay }</span>
            <span>/day</span>
          </div>
          <div 
            data-building="bundles"   
            className="building-bundles align-items-center"
          >
            { itHasBundles() 
              && 
              <a  
                href="#"       
                onClick={
                  (e)=>{
                    e.stopPropagation();
                    e.preventDefault(); 
                    navigate( '/buildings/' + props.buildingSearchResult.id + '#bundles')  
                  }
                }
              >See bundles</a>
            }

          </div>
</div>

        </div>

      </div>
    </div>
  </div>
  );
}


export default BuildingSearchResult;