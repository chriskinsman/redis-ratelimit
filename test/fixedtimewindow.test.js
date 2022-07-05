const assert = require("assert");
const fixedTimeWindow = require("./../index").fixedTimeWindow;

const timers = require("timers/promises");

const { v4: uuid } = require("uuid");
const dayjs = require("dayjs");
const redisClient = require("../lib/redisclient");

describe("Time Window Keys", () => {
  it("second", (done) => {
    var keyInfo = fixedTimeWindow._calculateKeyInfo(uuid(), "second");
    assert.equal(keyInfo.duration, 1);
    setImmediate(done);
  });

  it("minute", (done) => {
    var unit = "minute";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + dayjs().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });

  it("hour", (done) => {
    var unit = "hour";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + dayjs().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 60 * 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });

  it("day", (done) => {
    var unit = "day";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + dayjs().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 24 * 60 * 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });

  it("week", (done) => {
    var unit = "week";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + dayjs().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 7 * 24 * 60 * 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });

  it("month", (done) => {
    var unit = "month";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + dayjs().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 31 * 24 * 60 * 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });
});

describe("Time Window Rate Limit", () => {
  afterAll(() => {
    redisClient.close();
  });

  it("second should rate limit", async () => {
    let rateLimited = false;
    const key = uuid();

    for (let count = 0; count < 3; count++) {
      let limited = await fixedTimeWindow.check(key, "second", 1);
      if (limited) {
        rateLimited = true;
      }
    }

    assert(rateLimited, "Did not rate limit");
  });

  it("second should not rate limit", async () => {
    let rateLimited = false;
    const key = uuid();

    for (let count = 0; count < 3; count++) {
      let limited = await fixedTimeWindow.check(key, "second", 1);
      if (limited) {
        rateLimited = true;
      } else {
        await timers.setTimeout(1100);
      }
    }

    assert(!rateLimited, "Rate limited");
  });
});
