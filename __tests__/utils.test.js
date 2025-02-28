const {
  convertTimestampToDate, formatTopics, formatUsers, formatArticles
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
    const input1 = [ {}, {}, {} ];
    const input2 = [ {}, {}, {} ];
    const input3 = [ {}, {}, {} ];
    const result = formatArticles(input1, input2, input3);
    expect(result).toBeArray();
  })
  test("Converts the data to the expected type - from an object to an array of arrays, converts the date correctly and accesses both the topics and users arrays", () => {
    const usersInput = [
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
    const topicsInput = [
      { description: "The man, the Mitch, the legend", slug: "mitch", img_url: "" },
      { description: "Not dogs", slug: "cats", img_url: "" },
      { description: "What books are made of", slug: "paper", img_url: "" }
  ]
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
    const result = formatArticles(articlesInput, usersInput, topicsInput)
    const expectedResult = [
      ["Moustache", "mitch", "butter_bridge", "Have you seen the size of that thing?", new Date ("2020-10-11T12:24:00.000Z"),"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"],
      ["Another article about Mitch", "mitch", "butter_bridge", "There will never be enough articles about Mitch!", new Date ("2020-10-11T12:24:00.000Z"), "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"],
    ]
    console.log(result);
      expect(result).toEqual(expectedResult);
  })
})
