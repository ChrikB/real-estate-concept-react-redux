export default function AboutView(){

  require('./AboutView.css');

  return (
  <section className="about stats-view">
    <div className="row">
      <div className="col-12  mt-4">
        <h4>What is this ?</h4>
        <p>
          This project is a small part of a real-estate app from the past.<br></br>
          Images, titles, square feet, floors, locations, countries, user data etc are all random.<br></br>
          The concept is very similar to the original but everything else is reworked, simplified<br></br> and with different libraries/packages to create a proof of concept using <b>React/Redux</b><br></br>
          </p> <p>
          Design/css is simple and <b> Bootstrap 5 </b>is used.<br></br> Perfection and Eye-candy stuff is not the priority at this demo.<br></br>
          There is not server-side and database functionality. Everything happens in client side.<br></br>
          Sql, 'select' and 'join' statements have been all replaced <br></br> with typical javascript  array filtering(Unnecessary in official version).<br></br>
          <u><b>You can add 'users' and 'buildings' to see how it works</b></u> but nothing can be saved.<br></br>
          Initial data are fetched from a json file.<br></br>
          In this demo, Charts are fed with data from static data processing, <br></br>
          but in full version, data come from GA(google analytics api) usings metrics and dimensions.
          </p>
      </div>
      <div className="col-12 mt-4">
        <h4>General sections covered</h4>  
        <ul>
          <li>-Responsiveness</li>
          <li>-Forms and data validation(error tooltips in form fields after submit)</li>
          <li>-Array filtering(to simulate search)</li>
          <li>-Map interactions, setting and getting lat and lng(leaflet.js)</li>
          <li>-Copy to clipboard and file export</li>
          <li>-Reusable react.js components</li>
          <li>-Image uploading</li>
          <li>-Bootstrap Carousel</li>
          <li>-Multi Date and date-range Picking</li>
          <li>-Data processing and chart generation(chart.js)</li>
        </ul>             
      </div>
      <div className="col-12 mt-4">
        <h4>Libraries/packages used</h4>
        <ul>
          <li><a href="https://react.dev">React 18</a></li>
          <li><a href="https://www.npmjs.com/package/react-router-dom">react-router-dom</a></li>
          <li><a  onClick={()=>false}>Typescript ^4.9.5</a></li>
          <li><a href="https://www.npmjs.com/package/react-leaflet">React-leaflet</a></li>
          <li><a href="https://www.npmjs.com/package/chart.js?activeTab=readme">Chart.js</a></li>
          <li><a href="https://www.npmjs.com/package/react-datepicker">react-datepicker</a></li>
          <li><a href="https://www.npmjs.com/package/jszip">jszip</a></li>
          <li><a href="https://www.npmjs.com/package/file-saver">file-saver</a></li>
          <li><a href="https://www.npmjs.com/package/react-bootstrap">react-bootstrap</a></li>
          <li><a href="https://www.npmjs.com/package/leaflet">Leaflet.js(maps)</a></li>
          <li>Sample Photos from <b>Pixabay</b></li>
        </ul>       
      </div>
    </div>
  </section>
  );

}







