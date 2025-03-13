const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/ncnews.controllers");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", getEndpoints)

apiRouter.get("/", (request, response) => {
    response.status(200).send("All OK from /api")
})

module.exports = apiRouter;