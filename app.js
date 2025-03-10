const express = require("express");
const app = express();
const { getEndpoints } = require('./controllers/ncnews.controllers')

app.get('/api', getEndpoints);

module.exports = app;