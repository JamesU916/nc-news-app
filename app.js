const express = require("express");
const app = express();
const { getEndpoints, getTopics } = require('./controllers/ncnews.controllers');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./controllers/errors.controllers");

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;