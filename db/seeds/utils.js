const db = require("../../db/connection");
const topics = require("../data/test-data/topics");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

function formatTopics(topicsData){
  const formattedTopics = topicsData.map(({description, slug, img_url}) => {
    return [description, slug, img_url]
  });
  return formattedTopics;
};

function formatUsers(usersData){
  const formattedUsers = usersData.map(({username, name, avatar_url}) => {
    return [username, name, avatar_url]
  });
  return formattedUsers;
};

function formatArticles(articlesData){
  const formattedArticles = articlesData.map(({title, topic, author, body, created_at, votes = 0, article_img_url}) => {
    const {created_at: formattedDate} = convertTimestampToDate( {created_at} );
    return [title, topic, author, body, formattedDate, votes, article_img_url]
  });
  return formattedArticles;
};

function getArticleId(articlesData){
  const articleId = {};
  articlesData.forEach((article) => {
    articleId[article.title] = article.article_id;
  });
  return articleId;
}

function formatComments(commentsData, articleId){
  let commentIdCount = 1;
  let articleIdCount = 1;
  const formattedComments = commentsData.map(({article_title, body, votes = 0, author, created_at}) => {
    if (!articleId[article_title]) {
      articleId[article_title] = articleIdCount;
      articleIdCount++;
    }
    const {created_at: formattedDate} = convertTimestampToDate( {created_at} );
    const currentCommentId = commentIdCount;
    commentIdCount++;
    return [currentCommentId, articleId[article_title], body, votes, author, formattedDate]
  });
  return formattedComments;
};



module.exports = {formatTopics, formatUsers, convertTimestampToDate, formatArticles, formatComments, getArticleId}