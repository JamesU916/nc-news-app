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