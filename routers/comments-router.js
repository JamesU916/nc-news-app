const commentsRouter = require("express").Router();
const { deleteCommentById, patchCommentById } = require('../controllers/ncnews.controllers');

commentsRouter.route("/:comment_id")
.delete(deleteCommentById)
.patch(patchCommentById)

module.exports = commentsRouter;