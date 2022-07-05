"use strict";

const fixedWindow = require("./fixedwindow");
const moment = require("moment");

const FixedTimeWindow = {};

const _windowUnitDurations = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 24 * 60 * 60,
  week: 7 * 24 * 60 * 60,
  isoWeek: 7 * 24 * 60 * 60,
  month: 31 * 24 * 60 * 60,
  quarter: 3 * 31 * 24 * 60 * 60,
  year: 365 * 24 * 60 * 60,
};

// Exported for tests
FixedTimeWindow._calculateKeyInfo = function _calculateKeyInfo(
  keyPrefix,
  windowUnit
) {
  return {
    key: keyPrefix + ":" + moment().startOf(windowUnit).valueOf(),
    duration: _windowUnitDurations[windowUnit],
  };
};

FixedTimeWindow.check = async function check(keyPrefix, windowUnit, limit) {
  const keyInfo = FixedTimeWindow._calculateKeyInfo(keyPrefix, windowUnit);
  return fixedWindow.check(keyInfo.key, keyInfo.duration + 1, limit);
};

FixedTimeWindow.count = async function count(keyPrefix, windowUnit) {
  const keyInfo = FixedTimeWindow._calculateKeyInfo(keyPrefix, windowUnit);
  return fixedWindow.count(keyInfo.key);
};

module.exports = FixedTimeWindow;
