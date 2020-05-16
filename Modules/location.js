const superAgent = require('superagent');
require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

// Location Constructor

function Location(object, search_query) {
  this.search_query = search_query;
  this.formatted_query = object.display_name;
  this.latitude = object.lat;
  this.longitude = object.lon;
}
function result(results, response, request){
  if(results.rowCount > 0){
    response.send(results.rows[0])
  }else {
    const geoUrl = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${request.query.city}&format=json`;
    superAgent.get(geoUrl)
      .then(city => {
        cityArrow(city, response, request)
      }
      )
  }
}
function cityArrow(city, response, request){
  const location = new Location(city.body[0], request.query.city)
  const sqlQuery = 'INSERT INTO locations (latitude, search_query, longitude, formatted_query) VALUES($1, $2, $3, $4)';
  const sqlValues = [location.latitude, location.search_query, location.longitude, location.formatted_query];
  client.query(sqlQuery, sqlValues);
  response.send(location)
}

function locationCallBack(request, response) {
  const sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  const queryCity = request.query.city
  const sqlValues = [queryCity];
  client.query(sqlQuery, sqlValues)
    .then(results => {
      result(results, response, request)
    }
    ).catch(error => errors(error, response))
}

function errors(error, response){
  response.send(error).status(500)
}

module.exports = locationCallBack;