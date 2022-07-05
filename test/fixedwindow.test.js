const assert = require("assert");
const ratelimit = require("./../index").fixedWindow;
const { v4: uuid } = require("uuid");

describe("Fixed Window", function () {
  it("should rate limit", async function () {
    this.timeout(4000);
    let rateLimited = false;
    const key = uuid();

    for (let count = 0; count < 3; count++) {
      let limited = await ratelimit.check(key, 3, 2);
      if (limited) {
        rateLimited = true;
      }
    }

    assert(rateLimited, "Did not rate limit");
  });

  it("should not rate limit", async function () {
    this.timeout(4000);
    let rateLimited = false;
    const key = uuid();

    for (let count = 0; count < 3; count++) {
      let limited = await ratelimit.check(key, 3, 3);
      if (limited) {
        rateLimited = true;
      }
    }

    assert(!rateLimited, "Rate limited");
  });
});
