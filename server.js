const express = require('express');
const cors = require('cors');

// Global Variables

const PORT = process.env.PORT || 3000;
const app = express();

// Configuration

app.use(cors());

app.get('/location', (request, response) => {
    const locationData = require('.data/location.json');
    const longitude = locationData[0].lon;
    const latitude = locationData[0].lat;
})

// Run Server

app.listen(PORT, console.log(`we are up on ${PORT}`));