const usersRouter = require("express").Router();
const { getUsers } = require('../controllers/ncnews.controllers');

usersRouter.route("/")
.get(getUsers);

module.exports = usersRouter;

