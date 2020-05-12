const express = require('express');
const cors = require('cors');

// Global Variables

const PORT = process.env.PORT || 3000;
const app = express();

// Configuration

app.use(cors());

//Location Get

app.get('/location', (request, response) => {
    const locationData = require('./data/location.json');
    const frontEndRequest = request.query.city;
    console.log(request.query)
    // const longitude = locationData[0].lon;
    // const latitude = locationData[0].lat;
    // const locationArray = [];
    let locationObject = new Location(locationData[0], frontEndRequest);
    console.log(locationObject);
    response.send(locationObject);
})

// Location Constructor 

function Location(object, search_query){
    this.longitude = object.lon;
    this.latitude = object.lat;
    this.formatted_query = object.display_name;
    this.search_query = search_query;
}

// Weather Get

app.get('/weather', (request, response) => {
    const weatherData = require('./data/weather.json');
    const weatherArray = [];
    weatherData.data.forEach(value => {
        weatherArray.push(new Weather(value));
    })
    response.send(weatherArray);
})

// Weather Constructor

function Weather(object) {
    this.forecast = object.weather.description;
    this.time = new Date(object.ts * 1000).toDateString();
}
// Run Server

app.listen(PORT, console.log(`we are up on ${PORT}`));