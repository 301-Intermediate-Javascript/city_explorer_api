const superAgent = require('superagent');
require('dotenv').config();

// Movies Constructor

function Movie(object){
  this.title = object.title;
  this.overview = object.overview;
  this.average_votes = object.vote_average;
  this.total_votes = object.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${object.poster_path}`;
  this.popularity = object.popularity;
  this.released_on = object.release_date;
}

// Movies Callback

function moviesCallBack(request, response) {
  const moviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${request.query.search_query}&page=1&include_adult=false&region=US`
  superAgent.get(moviesUrl)
    .then(movie => {
      movieData(movie, response)
    }).catch(error => errors(error, response))
}

function movieData(movie, response){
  const movieMap = movie.body.results.map(value => {
    return new Movie(value)
  })
  response.send(movieMap);
}

// error

function errors(error, response){
  response.send(error).status(500)
}

module.exports = moviesCallBack;