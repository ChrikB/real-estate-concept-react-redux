

import  BuildingSearchResult from './BuildingSearchResult'


import { Building }  from './types'


function BuildingSearchResults( props: { buildingSearchResultsProp: Building[], removeBuilding?: Function } ){

  require('./BuildingSearchResults.css');

  return(
    <div className="building-search-results">
      <div className="row">
        { 
          props.buildingSearchResultsProp.map(     
            (result: Building , index: number) => <BuildingSearchResult  key={result.id}  removeBuilding={props.removeBuilding} buildingSearchResult={result} />
          )   
        }
      </div>
    </div>
  );

}


export default BuildingSearchResults;
