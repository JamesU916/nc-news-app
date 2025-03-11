const express = require("express");
const app = express();
const { getEndpoints, getTopics, getArticleById, getArticles, getArticleCommentsById, postComment, patchArticleVotesById } = require('./controllers/ncnews.controllers');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./controllers/errors.controllers");

app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getArticleCommentsById);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchArticleVotesById);

app.all('*', (request, response, next) => {
    response.status(404).send({ msg: "404 Not Found"});
})

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;