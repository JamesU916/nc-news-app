const usersRouter = require("express").Router();
const { getUsers, getUserByUsername } = require('../controllers/ncnews.controllers');

usersRouter.route("/")
.get(getUsers);

usersRouter.route("/:username")
.get(getUserByUsername);

module.exports = usersRouter;

