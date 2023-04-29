import React from "react";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";


import Dropdown from 'react-bootstrap/Dropdown';


export default function AppNavs() {


  const UsersCustomToggle = React.forwardRef(  ({ children, onClick }:any, ref:any) => (

    <Link 
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        to="/users/" 
        style={{backgroundColor: 'transparent' }}
        className="nav-link dropdown-toggle px-sm-0 px-1" 
        id="dropdown" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
    >Users</Link>


  ));

  const UsersCustomMenu = React.forwardRef(

    ({ children, style, className , 'aria-labelledby': labeledBy }:any, ref:any) => {

      return (

          <ul  aria-labelledby={labeledBy} style={style} ref={ref} className={"dropdown-menu dropdown-menu-dark text-small shadow " + className}>
              <li  className="list-group-item ps-1"><Link to="/users">All Users</Link></li>
              <li  className="list-group-item ps-1"><Link to="/uadd">Add User</Link></li>
          </ul>

      );
    },
  );




  const BuildingsCustomToggle = React.forwardRef(  ({ children, onClick }:any, ref:any) => (

    <Link 
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        style={{backgroundColor: 'transparent' }}
        to="/buildings" 
        className="nav-link dropdown-toggle px-sm-0 px-1" 
        id="dropdown" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
    >Buildings</Link>


  ));

  const BuildingsCustomMenu = React.forwardRef(

    ({ children, style, className , 'aria-labelledby': labeledBy }:any, ref:any) => {

      return (

          <ul  aria-labelledby={labeledBy} style={style} ref={ref} className={"dropdown-menu dropdown-menu-dark text-small shadow " + className}>
              <li  className="list-group-item ps-1"><Link to="/buildings">All Buildings</Link></li>
              <li  className="list-group-item ps-1"><Link to="/building/add">Add Building</Link></li>
              <li  className="list-group-item ps-1"><Link to='/buildings?availableTomorrow=true'>Find Building</Link></li> 
          </ul>

      );
    },
  );
  

  return (

      <div id="nav" className="col-12 col-sm-3 col-xl-2 px-sm-2 px-0 bg-dark d-flex sticky-top">
        <div className="d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-2 text-white">
          <ul 
            className="mt-md-5 nav nav-pills  flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-start"
          >

            <li className="nav_item"><Link to="/about">About</Link></li>



            <Dropdown as={'li'} className="nav_item dropdown d-sm-none">
            
                  <Dropdown.Toggle  as={UsersCustomToggle}></Dropdown.Toggle>
            
                  <Dropdown.Menu    
                    as={UsersCustomMenu} 
                    className="dropdown-menu dropdown-menu-dark text-small shadow"
                  >
                  </Dropdown.Menu>
            </Dropdown>            
            
            
            
            
            
            <Dropdown as={'li'} className="nav_item dropdown d-sm-none">
            
                  <Dropdown.Toggle  as={BuildingsCustomToggle}></Dropdown.Toggle>
            
                  <Dropdown.Menu  
                    as={BuildingsCustomMenu} 
                    className="dropdown-menu dropdown-menu-dark text-small shadow"
                  >
                  </Dropdown.Menu>
            
            </Dropdown>


            

            <li className="nav_item  	d-none d-md-block d-xl-block d-xxl-block" >
              <Link to="/buildings">Buildings</Link>
              <ul  className="list-group">
                <li className="list-group-item  pb-0">
                  <Link to="/building/add">Add building</Link>
                </li> 
                <li className="list-group-item  pb-0">
                  <Link id="buildings-link" to='/buildings?availableTomorrow=true'>Find building</Link>
                </li>
              </ul>
            </li>
            <li className="nav_item 	d-none d-md-block d-xl-block d-xxl-block" >
              <Link to="/users">Users</Link>
              <ul  className="list-group">
                <li  className="list-group-item  pb-0">
                  <Link to="/uadd">Add User</Link>
                </li>
              </ul>
            </li> 
            <li className="nav_item"><Link to="/extract">Export</Link></li>
            <li className="nav_item"><Link to="/stats">Stats</Link></li>            
          </ul>
        </div>
  
      </div>


  );


}