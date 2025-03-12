const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT slug, description FROM topics`).then(({ rows }) => {
        return rows;
    });
};

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
    const validSorting = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url"]
    const validOrdering = ["asc", "desc"]
    if(!validSorting.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "400 Bad Request - Must be sorted by a valid column" })
    }
    if(!validOrdering.includes(order)) {
        return Promise.reject({ status: 400, msg: "400 Bad Request - Must be ordered in either ascending or descending order"})
    }
    const queryString = (`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT (comments.comment_id) AS comment_count FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`)
        return db.query(queryString)
        .then(({ rows }) => {
            return rows
        });
};

exports.fetchUsers = () => {
    return db.query(`SELECT username, users.name, users.avatar_url FROM users`).then(({ rows }) => {
        return rows;
    });
}

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "404 Not Found"})
        }
        return rows[0];
    })
}

exports.fetchArticleCommentsById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: "404 Not Found"})
            }
            return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments 
                JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`, [id])
                .then (({ rows }) => {
                return rows;
            })
        })
}

exports.addComment = (author, body, article_id) => {
    return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) 
        RETURNING comment_id, votes, created_at, author, body, article_id`, [author, body, article_id])
        .then(({ rows }) => {
            return rows[0];
        })
}

exports.addArticleVotesById = (inc_votes, article_id) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "404 Not Found"})
        }
        return rows[0]
    })
}

exports.removeCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({ status: 404, msg: "404 Not Found - Comment does not exist"})
        }
    })
}