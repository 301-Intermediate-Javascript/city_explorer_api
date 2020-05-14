const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
const pg = require('pg');
require('dotenv').config();


// Global Variables

const PORT = process.env.PORT || 3000;
const app = express();

// Configuration

app.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();
//Location Get

app.get('/location', locationCallBack)

// Location Constructor

function Location(object, search_query) {
  this.search_query = search_query;
  this.formatted_query = object.display_name;
  this.latitude = object.lat;
  this.longitude = object.lon;
}

// Weather Get

app.get('/weather', weatherCallBack);

// Weather Constructor

function Weather(object) {
  this.forecast = object.weather.description;
  this.time = new Date(object.ts * 1000).toDateString();
}

// Trails Get

app.get('/trails', trailCallBack);

// Weather Constructor

function Trail(object) {
  this.name = object.name;
  this.location = object.location;
  this.length = object.length;
  this.stars = object.stars;
  this.star_votes = object.starVotes;
  this.summary = object.summary;
  this.trail_url = object.url;
  this.conditions = object.conditionStatus;
  this.condition_date = object.conditionDate.split(' ')[0];
  this.condition_time = object.conditionDate.split(' ')[1];
}

// Callback Functions
// Location
function locationCallBack(request, response) {
  const geoUrl = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${request.query.city}&format=json`;
  const sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  const queryCity = request.query.city
  const sqlValues = [queryCity];
  client.query(sqlQuery, sqlValues)
  .then(results => {
    console.log(results.rows[0]);
    if(results.rowCount > 0){
      response.send(results.rows[0])
    }else {
      superAgent.get(geoUrl)
          .then(city => {
        const location = new Location(city.body[0], request.query.city)
        const sqlQuery = 'INSERT INTO locations (latitude, search_query, longitude, formatted_query) VALUES($1, $2, $3, $4)';
        const sqlValues = [location.latitude, location.search_query, location.longitude, location.formatted_query];
        client.query(sqlQuery, sqlValues);
        response.send(location)
      }
      ).catch(error => errors(error, response))
  
        }
  })
}
// Weather
function weatherCallBack(request, response) {
  // const weatherData = require('./data/weather.json');
  const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.latitude}&lon=${request.query.longitude}&days=7&key=${process.env.WEATHER_API_KEY}`;
  superAgent.get(weatherUrl)
    .then(weather => {
      const weatherUrl2 = weather.body.data.map(value => {
        return new Weather(value);

      })
      response.send(weatherUrl2);

    }).catch(error => errors(error, response))
}
// Trail
function trailCallBack(request, response) {
  const trailUrl = `https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&key=${process.env.TRAIL_API_KEY}`
  superAgent.get(trailUrl)
    .then(trail => {
      const trailMap = trail.body.trails.map(value => {
        return new Trail(value);
      })
      response.send(trailMap);
    }).catch(error => errors(error, response))
}
// error
function errors(error, response){
  response.send(error).status(500)
}

// Run Server

app.listen(PORT, console.log(`we are up on ${PORT}`));
