const endpoints = require("../endpoints.json");

exports.getEndpoints = (request, response) => {
    response.status(200).json({endpoints});
}