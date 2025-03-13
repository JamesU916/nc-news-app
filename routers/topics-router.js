const topicsRouter = require("express").Router();
const { getTopics } = require('../controllers/ncnews.controllers');

topicsRouter.route("/")
.get(getTopics);

module.exports = topicsRouter;