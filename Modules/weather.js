const superAgent = require('superagent');
require('dotenv').config();

// Weather Constructor

function Weather(object) {
  this.forecast = object.weather.description;
  this.time = new Date(object.ts * 1000).toDateString();
}

// Weather
function weatherCallBack(request, response) {
  // const weatherData = require('./data/weather.json');
  const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.latitude}&lon=${request.query.longitude}&days=7&key=${process.env.WEATHER_API_KEY}`;
  superAgent.get(weatherUrl)
    .then(weather => {
      weatherData(weather, response)
    }).catch(error => errors(error, response))
}
function weatherData(weather, response){
  const weatherUrl2 = weather.body.data.map(value => {
    return new Weather(value);
  })
  response.send(weatherUrl2);
}
// error

function errors(error, response){
  response.send(error).status(500)
}

module.exports = weatherCallBack;