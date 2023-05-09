
import UserSearchResult from './UserSearchResult' 

import { User }  from './types'

function UserSearchResults(props: { userSearchResultsProp: User[], removeUser: Function } ){

  require('./UserSearchResults.css');

  return(
    <div className="user-search-results">
      <div className="row">    
         { props.userSearchResultsProp.map(     (result: User , index: number) => <UserSearchResult  key={index} removeUser={props.removeUser} userSearchResult={result} />)   }
      </div>
    </div>

  ); 

}


export default  UserSearchResults;


