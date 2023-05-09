
import './App.css';

import AppNavs from './routes';

import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  /*BrowserRouter*/ HashRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import AboutView from './pages/AboutView'
import BuildingSearchView from './pages/BuildingSearchView'
import BuildingInsertView from './pages/BuildingInsertView'
import BuildingUpdateView from './pages/BuildingUpdateView'
import BuildingDetailsView from './pages/BuildingDetailsView'

import StatsView from './pages/StatsView'
import ExtractView from './pages/ExtractView'
import UserSearchView from './pages/UserSearchView'
import UserInsertView from './pages/UserInsertView'

import UserUpdateView from './pages/UserUpdateView'


import {Navigate} from 'react-router-dom';


function App() {

  return (
    <div className="App">
      <div className="container-fluid overflow-hidden">
        <div className="row vh-100 overflow-auto">

        <Router>       
          <AppNavs />
          <div className="col d-flex flex-column h-sm-100">

              <h2 className="mt-5 mb-3">ADMIN DASHBOARD</h2>
            
              <Routes>
                <Route path="*"                   element={<Navigate to="/buildings" replace />} />
                <Route path="/about"              element={<AboutView/>}></Route>
                <Route path="/users"              element={<UserSearchView/>}></Route>
                <Route path="/buildings"          element={<BuildingSearchView/>}></Route>
                <Route path="/buildings/:id"      element={<BuildingDetailsView/>}></Route>
                <Route path="/building/add"       element={<BuildingInsertView/>}></Route>
                <Route path="/building/:id"       element={<BuildingUpdateView/>}></Route>
                <Route path="/stats"              element={<StatsView/>}></Route>
                <Route path="/extract"            element={<ExtractView/>}></Route>
                <Route path="/uadd"               element={<UserInsertView/>}></Route>
                <Route path="/user/:id"           element={<UserUpdateView/>}></Route>
              </Routes>
            
          </div>
        </Router>  

        </div>  
      </div>   
    </div>   
  );
}

export default App;
