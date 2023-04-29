

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './../app/hooks';

import {
  requestGetUsers,
} from './../components/user/userSlice';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);




function StatsView(){

    require('./StatsView.css');

    const dispatch: Function = useAppDispatch();

    const users = useAppSelector(store => store.user.users);
 
    const [pieData, setPieData] = useState<any>(null);

    const [barData, setBarData] = useState<any>(null);

    const [barDataCountry, setBarDataCountry] = useState<any>(null);

    const [barDataBuildingCountry, setBarDataBuildingCountry] = useState<any>(null);

    //const [buildings, setBuildings] = useState<any>(null);

    const [userSum, setUserSum] = useState<any>(null);

    const [buildingSum, setBuildingSum] = useState<any>(null);

    const [topBuildingVisits, setTopBuildingVisits] = useState<any>(null);

    const [topUserCountries,  setTopUserCountries] = useState<any>(null);

    const [topBuildingCountries, setTopBuildingCountries] = useState<any>(null);


    
    const initData = () => {

      let topBuildingCountries:any = {};
      let topUserCountries:any = {};
      let buildingsLen = 0;
      let userLen = users.length;
      let buildings:any = [];

      for (let m=0; m < userLen; m++) {
        buildingsLen = buildingsLen + (users[m].buildings?users[m].buildings.length:0);
        if (users[m].buildings) {

          let bLen = users[m].buildings.length;
          /* lets store user countries to an object*/
          let userCountry = users[m].country;

          if ( !topUserCountries.hasOwnProperty(userCountry)) {

            topUserCountries[userCountry] = 1;

          } else {

            topUserCountries[userCountry]++;
          }

          for(let b= 0; b < bLen; b++){
            /* lets store buildings to a flat array */
            buildings.push(users[m].buildings[b]);
            /* lets store building countries to an object  */

            let buildingCountry = users[m].buildings[b].country;

            if (!topBuildingCountries.hasOwnProperty(buildingCountry)) {

              topBuildingCountries[buildingCountry] = 1;

            } else {

              topBuildingCountries[buildingCountry]++;
            }
          }
        }
      }

      function compareVisits( a:any, b:any ) {
        if ( a.visits < b.visits ){
          return -1;
        }
        if ( a.visits > b.visits ){
          return 1;
        }
        return 0;
      }

      setUserSum(users.length);

      setBuildingSum(buildings.length);

      //setBuildings(buildings);   

      setTopBuildingVisits((dd: any) => { return [...buildings.sort( compareVisits ).slice(0, 3).reverse()] }   );

      setTopUserCountries(topUserCountries);

      setTopBuildingCountries(topBuildingCountries);
/*
      setProcessed((dd: any) => {
        let ddd = {...dd, ...processed};
        return ddd;
      });
      setValue(value => value + 1);
*/
      //setProcessed(processed);//alert(JSON.stringify(processed));
    };



    const pieSums = () => {
      let data = {
        labels: [
          'Users',
          'Buildings'
        ],
        datasets: [
          {
            label: 'Totals',
            data: [
           //   users.length, //
             // processed.
              userSum , 
            //  buildings.length//
             // processed.
              buildingSum 
            ],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)'
            ],
            hoverOffset: 4
          }
        ]
      };
      setPieData(data);
    };



    const visitsBars = () => {

      let labels = [];
      let visits = [];
      if (!topBuildingVisits){return;}
      for(let m =0; m< topBuildingVisits.length; m++){
        labels.push(topBuildingVisits[m].buildingName);
        visits.push(topBuildingVisits[m].visits);
      }
      let data = {
        labels:  labels,
        datasets: [{
          label: 'Visits',
          data: visits,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      };
      setBarData(data);
    };    



    const userCountriesBars = () => {

      if (!topUserCountries){return;}

      const data = {
        labels:  Object.keys(topUserCountries).slice(0, 3) ,
        datasets: [{
          label: 'Users',
          data: Object.values(topUserCountries).slice(0, 3) ,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      };
      setBarDataCountry(data);
    };    



    const buildingCountriesBars = () => {

      if (!topBuildingCountries){
        return;
      } 
      
      const data = {
        labels:  Object.keys(topBuildingCountries).slice(0, 3) ,
        datasets: [{
          axis: 'y',
          label: 'Buildings',
          data: Object.values(topBuildingCountries).slice(0, 3) ,
          backgroundColor: [
            'rgba(201, 203, 207, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      };

      setBarDataBuildingCountry(data);
    };



    useEffect(() => {

      dispatch( requestGetUsers({}) );
    
    }, []); 



    useEffect(() => {
  
      initData();

    }, [users]);



    useEffect(() => {

      pieSums();

    }, [userSum, buildingSum]);



    useEffect(() => {

      visitsBars();

    }, [topBuildingVisits]); 



    useEffect(() => {

      userCountriesBars();

    }, [topUserCountries]); 



    useEffect(() => {

      buildingCountriesBars();

    }, [topBuildingCountries]); 



    return (
      <section className="stats-view stats-view-scoped mb-4 mt-4 m-auto">
        <h4 className="mb-4">Stats</h4>
        <div className="row align-items-center  mt-4 mb-4">
          <div className="col-12 col-md-12 col-lg-6 mb-4 chart-col">
            <h5>Total Users and Buildings</h5> 
            <div className="chart-cont">

              { pieData && 
                <Pie data={pieData} />
              }

            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6 mb-4 chart-col">
            <h5>Most visited buildings</h5>   
            <div className="chart-cont">

              { barData && 
                <Bar /*options={options}*/ data={barData} />
              }

            </div>   
          </div> 
        </div>
        <div className="row  align-items-center mt-4  mb-4">
          <div className="col-12 col-md-12 col-lg-6 mb-4 chart-col">  
            <h5>Countries with most users</h5>   
            <div className="chart-cont">

              { barDataCountry && 
                <Bar options={ {indexAxis: 'x'}} data={barDataCountry} />
              }

            </div>
          </div>   
          <div className="col-12 col-md-12 col-lg-6 mb-4 chart-col">
            <h5>Countries with most buildings</h5>
            <div  className="chart-cont">

              { barDataBuildingCountry && 
                <Bar options={ {indexAxis: 'y',scales: {y: {ticks: {precision: 1}}}}} data={barDataBuildingCountry} />
              }

            </div>
          </div>       
        </div>
      </section>
    );
  
}


export default StatsView;


