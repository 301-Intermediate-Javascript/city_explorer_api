const express = require('express');
const cors = require('cors');
const superAgent = require('superagent');
const pg = require('pg');
require('dotenv').config();
const locationCallBack = require('./Modules/location.js')
const weatherCallBack = require('./Modules/weather.js')
const trailCallBack = require('./Modules/trails.js')
const moviesCallBack = require('./Modules/movies.js')
const yelpCallBack = require('./Modules/yelp.js')

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

// Weather Get

app.get('/weather', weatherCallBack);

// Trails Get

app.get('/trails', trailCallBack);

// Movies Get

app.get('/movies', moviesCallBack);

// Yelp Get

app.get('/yelp', yelpCallBack);

// Run Server

app.listen(PORT, console.log(`we are up on ${PORT}`));
