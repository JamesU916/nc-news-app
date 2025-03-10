const endpoints = require("../endpoints.json");
const { fetchTopics, fetchArticleById, fetchArticles } = require("../models/ncnews.models");

exports.getEndpoints = (request, response) => {
    response.status(200).json({endpoints});
}

exports.getTopics = (request, response) => {
    fetchTopics().then((topics) => {
        response.status(200).json({ topics })
    });
};

exports.getArticles = (request, response) => {
    fetchArticles().then((articles) => {
        response.status(200).json({ articles })
    });
};

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    if(!article_id) {
        response.status(404).json({msg: "Not Found"})
    }
    fetchArticleById(article_id).then((article) => {
        response.status(200).json({ article })
    })
    .catch((error) => {
        next(error)
    });
};