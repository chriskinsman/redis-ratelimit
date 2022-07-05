const assert = require("assert");
const ratelimit = require("./../index").slidingWindow;

const { v4: uuid } = require("uuid");
const timers = require("timers/promises");

describe("Sliding Window", function () {
  it("should rate limit", async function () {
    this.timeout(4000);

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

  it("should not rate limit", async function () {
    this.timeout(4000);

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
