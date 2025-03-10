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