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