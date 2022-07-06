import fixedWindow from "./fixedwindow.mjs";
import dayjs from "dayjs";

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
function _calculateKeyInfo(keyPrefix, windowUnit) {
  return {
    key: keyPrefix + ":" + dayjs().startOf(windowUnit).valueOf(),
    duration: _windowUnitDurations[windowUnit],
  };
}

async function check(keyPrefix, windowUnit, limit) {
  const keyInfo = _calculateKeyInfo(keyPrefix, windowUnit);
  return fixedWindow.check(keyInfo.key, keyInfo.duration + 1, limit);
}

async function count(keyPrefix, windowUnit) {
  const keyInfo = _calculateKeyInfo(keyPrefix, windowUnit);
  return fixedWindow.count(keyInfo.key);
}

export default { _calculateKeyInfo, check, count };
