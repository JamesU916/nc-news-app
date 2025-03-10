const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT slug, description FROM topics`).then(({rows}) => {
        return rows;
    });
};

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "404 Not Found"})
        }
        return rows;
    })
}