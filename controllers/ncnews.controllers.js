const endpoints = require("../endpoints.json");
const { fetchTopics } = require("../models/ncnews.models");

exports.getEndpoints = (request, response) => {
    response.status(200).json({endpoints});
}

exports.getTopics = (request, response) => {
    fetchTopics().then((topics) => {
        response.status(200).json({ topics })
    });
};