const endpointsJson = require("../endpoints.json")
/* Set up your test imports here */
const app = require("../app");
const data = require("../db/data/test-data");
const db = (require("../db/connection"))
const request = require("supertest");
const seed = require("../db/seeds/seed");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data)
});

afterAll(() => {
  return db.end()
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/notAnEndpoint", () => {
  test("404: Returns a 404 when passed an endpoint that doesn't exist", () => {
    return request(app)
    .get("/api/notAnEndpoint")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("404 Not Found")
    });
  });
})

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each containing a slug and description property", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      const topics = body.topics;
      expect(topics.length).toBe(3)
      topics.forEach((topic) => {
        expect(typeof topic.description).toBe("string")
        expect(topic.description.length).not.toBe(0)
        expect(typeof topic.slug).toBe("string")
        expect(topic.slug.length).not.toBe(0);
      });
    });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects containing the specified properties, sorted by date order descending", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const articles = body.articles;
      articles.forEach((article) => {
        expect(typeof article.author).toBe("string")
        expect(typeof article.title).toBe("string")
        expect(typeof article.article_id).toBe("number")
        expect(typeof article.topic).toBe("string")
        expect(typeof article.created_at).toBe("string")
        expect(typeof article.votes).toBe("number")
        expect(typeof article.article_img_url).toBe("string")
        expect(typeof article.comment_count).toBe("string")
      })
      expect(articles).toBeSortedBy("created_at", { descending: true});
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article with the specified ID", () => {
    return request(app)
    .get("/api/articles/2")
    .expect(200)
    .then(({ body }) => {
      const article = body.article;
      expect(article.author).toBe("icellusedkars")
      expect(article.title).toBe("Sony Vaio; or, The Laptop")
      expect(article.article_id).toBe(2)
      expect(article.body).toBe("Call me Mitchell. Some years ago..")
      expect(article.topic).toBe("mitch")
      expect(article.created_at).toBe("2020-10-16T05:03:00.000Z")
      expect(article.votes).toBe(0)
      expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
    })
  })
  test("400: Responds with an error when a non-numerical value is passed as a query", () => {
    return request(app)
    .get("/api/articles/badRequest")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("400 Bad Request")
    });
  });
  test("404: Responds with an error when a numerical value is passed that doesn't exist", () => {
    return request(app)
    .get("/api/articles/9999999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("404 Not Found")
    });
  });
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Gets all comments for a given article, sorted in descending date order", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      const comments = body.comments;
      comments.forEach((comment) => {
        expect(typeof comment.comment_id).toBe("number")
        expect(typeof comment.votes).toBe("number")
        expect(typeof comment.created_at).toBe("string")
        expect(typeof comment.author).toBe("string")
        expect(typeof comment.body).toBe("string")
        expect(typeof comment.article_id).toBe("number")
        expect(comment.article_id).toBe(1)
      })
      expect(comments).toBeSortedBy("created_at", { descending: true});
    })
  })
  test("400: Responds with an error when a non-numerical value is passed as a query", () => {
    return request(app)
    .get("/api/articles/badRequest/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("400 Bad Request")
    });
  });
  test("404: Responds with an error when a numerical value is passed that doesn't exist", () => {
    return request(app)
    .get("/api/articles/9999999/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("404 Not Found")
    });
  });
})

