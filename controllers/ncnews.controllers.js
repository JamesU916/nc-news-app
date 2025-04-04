const { request, response } = require("../app");
const endpoints = require("../endpoints.json");
const { fetchTopics, fetchArticleById, fetchArticles, fetchArticleCommentsById, addComment, addArticleVotesById, removeCommentById, fetchUsers, fetchUserByUsername, addCommentVotesById } = require("../models/ncnews.models");

exports.getEndpoints = (request, response) => {
    response.status(200).json({endpoints});
}

exports.getTopics = (request, response) => {
    fetchTopics().then((topics) => {
        response.status(200).json({ topics })
    });
};

exports.getArticles = (request, response, next) => {
    const {sort_by, order, topic } = request.query;
    fetchArticles(sort_by, order, topic).then((articles) => {
        response.status(200).json({ articles })
    })
    .catch((error) => {
        next(error)
    });
};

exports.getUsers = (request, response) => {
    fetchUsers().then((users) => {
        response.status(200).json({ users })
    });
}

exports.getUserByUsername = (request, response, next) => {
    const { username } = request.params;
    fetchUserByUsername(username).then((user) => {
        response.status(200).json({ user })
    })
    .catch((error) => {
        next(error)
    })
}

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

exports.getArticleCommentsById = (request, response, next) => {
    const { article_id } = request.params;
    if(!article_id) {
        response.status(404).json({ msg: "Not Found"})
    }
    fetchArticleCommentsById(article_id).then((comments) => {
        response.status(200).json({ comments : comments })
    })
    .catch((error) => {
        next(error)
    });
}

exports.postComment = (request, response, next) => {
    const { article_id } = request.params;
    const { username, body } = request.body;
    if(!username || !body || !username && !body) {
        return response.status(400).json({ msg: "400 Bad Request - Comment must include both a username and body"})
    }
    if(typeof username !== "string" || typeof body !== "string" || typeof username !== "string" && typeof body !== "string") {
        return response.status(400).json({ msg: "400 Bad Request - Comment parameters must be of string value"})
    }
    const newComment = {
        author: username,
        body: body,
        article_id: article_id
    }
    addComment(newComment.author, newComment.body, newComment.article_id)
    .then((comment) => {
        response.status(201).send({comment: comment})
    })
    .catch((error) => {
        next(error)
    });
}

exports.patchArticleVotesById = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;
    if (inc_votes === undefined) {
        return response.status(400).json({ msg: "400 Bad Request"})
    }
    addArticleVotesById(inc_votes, article_id)
    .then((article) => {
        response.status(200).send({ article })
    })
    .catch((error) => {
        next(error)
    })
}

exports.patchCommentById = (request, response, next) => {
    const { comment_id } = request.params;
    const { inc_votes } = request.body;
    if (inc_votes === undefined) {
        return response.status(400).json({ msg: "400 Bad Request"})
    }
    addCommentVotesById(inc_votes, comment_id)
    .then((comment) => {
        response.status(200).send({ comment })
    })
    .catch((error) => {
        next(error)
    })
}

exports.deleteCommentById = (request, response, next) => {
    const { comment_id } = request.params;
    removeCommentById(comment_id)
    .then(() => {
        response.status(204).send()
    })
    .catch((error) => {
        next(error);
    })
}