const assert = require("assert");
const fixedTimeWindow = require("./../index").fixedTimeWindow;

const timers = require("timers/promises");

const { v4: uuid } = require("uuid");
const moment = require("moment");

describe("Time Window Keys", function () {
  it("second", function (done) {
    var keyInfo = fixedTimeWindow._calculateKeyInfo(uuid(), "second");
    assert.equal(keyInfo.duration, 1);
    setImmediate(done);
  });

  it("minute", function (done) {
    var unit = "minute";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + moment().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });

  it("hour", function (done) {
    var unit = "hour";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + moment().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 60 * 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });

  it("day", function (done) {
    var unit = "day";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + moment().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 24 * 60 * 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });

  it("week", function (done) {
    var unit = "week";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + moment().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 7 * 24 * 60 * 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });

  it("month", function (done) {
    var unit = "month";
    var keyPrefix = uuid();
    var key = keyPrefix + ":" + moment().startOf(unit);
    var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
    assert.equal(keyInfo.duration, 31 * 24 * 60 * 60);
    assert.equal(keyInfo.key, key);
    setImmediate(done);
  });
});

describe("Time Window Rate Limit", function () {
  it("second should rate limit", async function () {
    this.timeout(4000);
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

  it("second should not rate limit", async function () {
    this.timeout(4000);
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
