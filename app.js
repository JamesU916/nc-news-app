const express = require("express");
const cors = require("cors");
const app = express();
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers");
const apiRouter = require("./routers/api-router");
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "404 Not Found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
