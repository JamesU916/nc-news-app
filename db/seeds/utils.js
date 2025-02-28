const db = require("../../db/connection")

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

function formatArticles(articlesData, topicsData, usersData){
  console.log("topicsData: ", topicsData); 
  console.log("usersData: ", usersData); 
  const formattedArticles = articlesData.map(({title, topic, author, body, created_at, article_img_url}) => {
    topic = topicsData.slug;
    author = usersData.username;
    const {created_at: formattedDate} = convertTimestampToDate( {created_at} );
    return [title, topic, author, body, formattedDate, article_img_url]
  });
  return formattedArticles;
};


module.exports = {formatTopics, formatUsers, convertTimestampToDate, formatArticles}