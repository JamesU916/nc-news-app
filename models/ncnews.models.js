const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT slug, description FROM topics`).then(({rows}) => {
        return rows;
    });
};

exports.fetchArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT (comments.comment_id) AS comment_count FROM articles 
        JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`)
        .then(({ rows }) => {
            return rows
        });
};

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "404 Not Found"})
        }
        return rows[0];
    })
}

exports.fetchArticleCommentsById = (id) => {
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments 
        JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`, [id])
        .then (({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: "404 Not Found"})
            }
        return rows;
        })
}

exports.addComment = (author, body, article_id) => {
    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) 
        RETURNING comment_id, votes, created_at, author, body, article_id`, [author, body, article_id])
        .then(({ rows }) => {
            return rows[0];
        })
}