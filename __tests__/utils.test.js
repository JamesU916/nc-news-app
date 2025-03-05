const {
  convertTimestampToDate, formatTopics, formatUsers, formatArticles, getArticleId, formatComments
} = require("../db/seeds/utils");


describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("formatTopics helper functions tests", () => {
  test("Returns an array", () => {
    const input = [ {}, {}, {} ];
    const result = formatTopics(input);
    expect(result).toBeArray();
  })
  test("Converts the data to the expected type - from an object to an array of arrays", () => {
    const input = [
      { description: "The man, the Mitch, the legend", slug: "mitch", img_url: "" },
      { description: "Not dogs", slug: "cats", img_url: "" },
      { description: "What books are made of", slug: "paper", img_url: "" }
  ]
    const result = formatTopics(input)
    const expectedResult = [
      ["The man, the Mitch, the legend", "mitch", ""],
      ["Not dogs", "cats", ""],
      ["What books are made of", "paper", ""]]
      expect(result).toEqual(expectedResult);
  })
})

describe("formatUsers helper functions tests", () => {
  test("Returns an array", () => {
    const input = [ {}, {}, {} ];
    const result = formatUsers(input);
    expect(result).toBeArray();
  })
  test("Converts the data to the expected type - from an object to an array of arrays", () => {
    const input = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
      {
        username: "rogersop",
        name: "paul",
        avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      },
      {
        username: "lurker",
        name: "do_nothing",
        avatar_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ]
    const result = formatUsers(input)
    const expectedResult = [
      ["butter_bridge", "jonny", "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"],
      ["icellusedkars", "sam", "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"],
      ["rogersop", "paul", "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"],
      ["lurker", "do_nothing", "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"],
    ]
      expect(result).toEqual(expectedResult);
  })
})

describe("formatArticles helper functions tests", () => {
  test("Returns an array", () => {
    const input = [ {}, {}, {} ];
    const result = formatArticles(input);
    expect(result).toBeArray();
  })
  test("Converts the data to the expected type - from an object to an array of arrays, converts the date correctly, correctly returns the foreign keys & incorporates a votes parameter", () => {
    const articlesInput = [
      {
      title: "Moustache",
      topic: "mitch",
      author: "butter_bridge",
      body: "Have you seen the size of that thing?",
      created_at: 1602419040000,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
    {
      title: "Another article about Mitch",
      topic: "mitch",
      author: "butter_bridge",
      body: "There will never be enough articles about Mitch!",
      created_at: 1602419040000,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    },
  ]
    const result = formatArticles(articlesInput)
    const expectedResult = [
      ["Moustache", "mitch", "butter_bridge", "Have you seen the size of that thing?", new Date ("2020-10-11T12:24:00.000Z"), 0, "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"],
      ["Another article about Mitch", "mitch", "butter_bridge", "There will never be enough articles about Mitch!", new Date ("2020-10-11T12:24:00.000Z"), 0, "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"],
    ]
      expect(result).toEqual(expectedResult);
  })
})

describe("getArticleId helper function tests", () => {
  test("Returns an object", () => {
    const input = [ {}, {}, {} ];
    const result = getArticleId(input);
    expect(result).toBeObject();
  })
  test("Returns correctly formatted data with associated comment ID's", () => {
    const input = [
      { article_id: 1, title: "They're not exactly dogs, are they?" },
      { article_id: 2, title: "Living in the shadow of a great man" },
    ];
    const result = getArticleId(input);
    const expectedResult = {
      "They're not exactly dogs, are they?": 1,
      "Living in the shadow of a great man": 2
    };
    expect(result).toEqual(expectedResult);
  })
})

describe("formatComments helper functions tests", () => {
  test("Returns an array", () => {
    const input = [ {}, {}, {} ];
    const articleId = {};
    const result = formatComments(input, articleId);
    expect(result).toBeArray();
  })
  test("Converts the data to the expected type - from an object to an array of arrays, converts the date correctly, correctly returns the foreign keys & incorporates a votes parameter", () => {
    const commentsInput = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "Living in the shadow of a great man",
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        created_at: 1604113380000,
      },
      
  ]
  const articleId = {
    "They're not exactly dogs, are they?": 1,
    "Living in the shadow of a great man": 2
  };
    const result = formatComments(commentsInput, articleId)
    const expectedResult = [ 
      [1, "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!", 16, "butter_bridge", new Date("2020-04-06T13:17:00.000Z")],
      [2, "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.", 14, "butter_bridge", new Date("2020-10-31T03:03:00.000Z")],
    ]
      expect(result).toEqual(expectedResult);
  })
})