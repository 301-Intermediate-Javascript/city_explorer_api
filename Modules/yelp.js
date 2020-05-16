const superAgent = require('superagent');
require('dotenv').config();

// Yelp Constructor

function Yelp(object){
  this.name = object.name;
  this.image_url = object.image_url;
  this.price = object.price;
  this.rating = object.rating;
  this.url = object.url;
}

// Yelp Callback

function yelpCallBack(request, response) {
  const yelpUrl = 'https://api.yelp.com/v3/businesses/search';
  const apiKey = 'Bearer ' + process.env.YELP_API_KEY;
  // clientYelp.search({
  //   term: 'restaraunt',
  //   location: `${request.query.search_query}`,
  // })
  const city = request.query.search_query;
  const search = {
    term: 'restaraunt',
    location: `${city}`,
  }
  superAgent.get(yelpUrl)
    .set('Authorization', apiKey)
    .query(search)
    .then(food => {
      foodData(food, response)
    }).catch(error => errors(error, response))
}
function foodData(food, response){
  const foodSpots = food.body.businesses.map(value =>{
    return new Yelp(value)
  })
  response.send(foodSpots);
}
// error

function errors(error, response){
  response.send(error).status(500)
}

module.exports = yelpCallBack;