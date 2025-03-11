const endpointsJson = require("../endpoints.json")
const app = require("../app");
const data = require("../db/data/test-data");
const db = (require("../db/connection"))
const request = require("supertest");
const seed = require("../db/seeds/seed");

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
        expect(article.author.length).not.toBe(0)
        expect(typeof article.title).toBe("string")
        expect(article.title.length).not.toBe(0)
        expect(typeof article.article_id).toBe("number")
        expect(article.article_id.length).not.toBe(0)
        expect(typeof article.topic).toBe("string")
        expect(article.topic.length).not.toBe(0)
        expect(typeof article.created_at).toBe("string")
        expect(article.created_at.length).not.toBe(0)
        expect(typeof article.votes).toBe("number")
        expect(article.votes.length).not.toBe(0)
        expect(typeof article.article_img_url).toBe("string")
        expect(article.article_img_url.length).not.toBe(0)
        expect(typeof article.comment_count).toBe("string")
        expect(article.comment_count.length).not.toBe(0)
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
      expect(article).toMatchObject({
        author: "icellusedkars",
        title: "Sony Vaio; or, The Laptop",
        article_id: 2,
        body: "Call me Mitchell. Some years ago..",
        topic: "mitch",
        created_at: "2020-10-16T05:03:00.000Z",
        votes: 0,
        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
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
        expect(comment.comment_id.length).not.toBe(0)
        expect(typeof comment.votes).toBe("number")
        expect(comment.votes.length).not.toBe(0)
        expect(typeof comment.created_at).toBe("string")
        expect(comment.created_at.length).not.toBe(0)
        expect(typeof comment.author).toBe("string")
        expect(comment.author.length).not.toBe(0)
        expect(typeof comment.body).toBe("string")
        expect(comment.body.length).not.toBe(0)
        expect(typeof comment.article_id).toBe("number")
        expect(comment.article_id.length).not.toBe(0)
        expect(comment.article_id).toBe(1)
      })
      expect(comments).toBeSortedBy("created_at", { descending: true});
    })
  })
  test("200: Responds with an empty array where an article exists but has no comments", () => {
    return request(app)
    .get("/api/articles/4/comments")
    .expect(200)
    .then(({ body }) => {
      comments = body.comments;
      expect(comments.length).toBe(0)
      expect(comments).toBeArray();
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

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: Successfully adds a new comment for an article", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({"username": "icellusedkars", "body": "test body"})
    .expect(201)
    .then(({ body }) => {
      comment = body.comment
      expect(comment).toMatchObject({
        body: "test body",
        votes: 0,
        author: "icellusedkars"
      })
      expect(comment.article_id).toBe(1)
      expect(comment.comment_id).toBe(19)
      expect(typeof comment.created_at).toBe("string")
    })
  })
  test("201: Successfully adds a new comment for an article & ignores other properties passed in the object", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({"username": "icellusedkars", "body": "test body", "article_id": 1})
    .expect(201)
    .then(({ body }) => {
      comment = body.comment
      expect(comment).toMatchObject({
        body: "test body",
        votes: 0,
        author: "icellusedkars"
      })
      expect(comment.article_id).toBe(1)
      expect(comment.comment_id).toBe(19)
      expect(typeof comment.created_at).toBe("string")
    })
  })
  test("400: Responds with an error when a attempting to post to an article ID of string value", () => {
    return request(app)
    .post("/api/articles/badRequest/comments")
    .send({"username": "icellusedkars", "body": "test body"})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("400 Bad Request")
    });
  });
  test("400: Responds with an error when a required parameter is missing", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({"username": "icellusedkars"})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("400 Bad Request - Comment must include both a username and body")
    });
  });
  test("400: Responds with an error when a required parameter is of the wrong type", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({"username": "icellusedkars", "body": 1})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("400 Bad Request - Comment parameters must be of string value")
    });
  });
  test("404: Responds with an error attempting to post to an article that doesn't exist", () => {
    return request(app)
    .post("/api/articles/9999999/comments")
    .send({"username": "icellusedkars", "body": "test body"})
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("404 Not Found")
    });
  });
  test("404: Responds with an error attempting to post to an article with a username that doesn't exist in the database", () => {
    return request(app)
    .post("/api/articles/1/comments")
    .send({"username": "NotaUser", "body": "test body"})
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("404 Not Found")
    });
  });
})

describe("PATCH: /api/articles/:article_id", () => {
  test("200: Responds with the updated article with incremented votes", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: 1})
    .expect(200)
    .then(({ body }) => {
      article = body.article;
      expect(article.votes).toBe(101);
    })
  })
  test("200: Responds with the updated article with decremented votes", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: -100})
    .expect(200)
    .then(({ body }) => {
      article = body.article;
      expect(article.votes).toBe(0);
    })
  })
  test("400: Responds with an error if the increment value is not of number value", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: "badRequest"})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("400 Bad Request")
    })
  })
  test("400: Responds with an error if the article id is not of number value", () => {
    return request(app)
    .patch("/api/articles/badRequest")
    .send({ inc_votes: 1})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("400 Bad Request")
    })
  })
  test("404: Responds with an error if the article doesn't exist", () => {
    return request(app)
    .patch("/api/articles/9999999")
    .send({ inc_votes: 1})
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("404 Not Found")
    })
  })
})