const superAgent = require('superagent');
require('dotenv').config();

// Trail Constructor

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
  
module.exports = trailCallBack;