const articlesRouter = require("express").Router();
const { getArticles, getArticleById, getArticleCommentsById, patchArticleVotesById, postComment }= require('../controllers/ncnews.controllers');

articlesRouter.route("/")
.get(getArticles);

articlesRouter.route("/:article_id")
.get(getArticleById)
.patch(patchArticleVotesById)

articlesRouter.route("/:article_id/comments")
.get(getArticleCommentsById)
.post(postComment)

module.exports = articlesRouter;