import assert from "assert";
import rateLimit from "../lib/slidingwindow.mjs";
import { v4 as uuid } from "uuid";

import timers from "timers/promises";

import redisClient from "../lib/redisclient.mjs";

describe("Sliding Window", () => {
  afterAll(() => {
    redisClient.close();
  });

  it("should rate limit", async () => {
    let rateLimited = false;
    const key = uuid();

    for (let count = 0; count < 3; count++) {
      let limited = await rateLimit.check(key, 2, 2);
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
      let limited = await rateLimit.check(key, 2, 2);
      if (limited) {
        rateLimited = true;
      } else {
        await timers.setTimeout(1000);
      }
    }

    assert(!rateLimited, "Rate limited");
  });
});
