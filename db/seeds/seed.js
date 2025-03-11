const db = require("../connection")
const format = require("pg-format")
const { formatTopics, formatUsers, formatArticles, getArticleId, formatComments } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS articles")
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users")
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS topics")
  })
  .then(() => {
    return createTopics(topicData)
  })
  .then(() => {
    return createUsers(userData)
  })
  .then(() => {
    return createArticles(articleData)
  })
  .then(({rows: insertedArticles}) => {
    return createComments(commentData, insertedArticles);
  })
};


function createTopics(topicData) {
  return db.query(
    `CREATE TABLE topics (
    slug VARCHAR (200) PRIMARY KEY NOT NULL,
    description VARCHAR(500) NOT NULL,
    img_url VARCHAR(1000)
    )`
  )
  .then(() => {
    const formattedTopics = formatTopics(topicData);
    const topicsData = format(`INSERT INTO topics (description, slug, img_url) VALUES %L RETURNING *`, formattedTopics)
    return db.query(topicsData);
  })
};

function createUsers(userData) {
  return db.query(
    `CREATE TABLE users (
    username VARCHAR (200) PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(1000)
    )`
  )
  .then(() => {
    const formattedUsers = formatUsers(userData);
    const usersData = format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *`, formattedUsers)
    return db.query(usersData);
  })
};

function createArticles(articleData) {
  return db.query(
    (`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY NOT NULL,
      title VARCHAR (500) NOT NULL,
      topic VARCHAR (200),
      FOREIGN KEY (topic) REFERENCES topics(slug),
      author VARCHAR (200),
      FOREIGN KEY (author) REFERENCES users(username),
      body TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      article_img_url VARCHAR(1000)
      )`)
  )
  .then(() => {
    const formattedArticles = formatArticles(articleData);
    const articlesData = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, formattedArticles)
    return db.query(articlesData);
  })
  
};

function createComments(commentData, insertedArticles) {
  return db.query(
    (`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY NOT NULL,
      article_id INT NOT NULL,
      FOREIGN KEY (article_id) REFERENCES articles (article_id),
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR (200) NOT NULL,
      FOREIGN KEY (author) REFERENCES users (username),
      created_at TIMESTAMP DEFAULT NOW()
      )`)
  )
  .then(() => {
    const articleLookup = getArticleId(insertedArticles);
    const formattedComments = formatComments(commentData, articleLookup);
    const commentsData = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *`, formattedComments, articleLookup)
    return db.query(commentsData);
  })
};
module.exports = seed;
