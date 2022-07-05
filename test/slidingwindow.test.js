const assert = require("assert");
const ratelimit = require("./../index").slidingWindow;

const { v4: uuid } = require("uuid");
const timers = require("timers/promises");
const redisClient = require("../lib/redisclient");

describe("Sliding Window", () => {
  afterAll(() => {
    redisClient.close();
  });

  it("should rate limit", async () => {
    let rateLimited = false;
    const key = uuid();

    for (let count = 0; count < 3; count++) {
      let limited = await ratelimit.check(key, 2, 2);
      if (limited) {
        rateLimited = true;
        await timers.setTimeout(1000);
      }
    }

    assert(rateLimited, "Did not rate limit");
  });

  it("should not rate limit", async () => {
    let rateLimited = false;
    const key = uuid();

    for (let count = 0; count < 3; count++) {
      let limited = await ratelimit.check(key, 2, 2);
      if (limited) {
        rateLimited = true;
      } else {
        await timers.setTimeout(1000);
      }
    }

    assert(!rateLimited, "Rate limited");
  });
});
