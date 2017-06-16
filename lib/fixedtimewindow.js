'use strict';

var fixedWindow = require('./fixedwindow');
var moment = require('moment');

var FixedTimeWindow = {};

var _windowUnitDurations = {
    'second': 1,
    'minute': 60,
    'hour': 60 * 60,
    'day': 24 * 60 * 60,
    'week': 7 * 24 * 60 * 60,
    'isoWeek': 7 * 24 * 60 * 60,
    'month': 31 * 24 * 60 * 60,
    'quarter': 3 * 31 * 24 * 60 * 60,    
    'year': 365 * 24 * 60 * 60
};

// Exported for tests
FixedTimeWindow._calculateKeyInfo = function _calculateKeyInfo(keyPrefix, windowUnit) {
    return {
        key: keyPrefix + ':' + moment().startOf(windowUnit).valueOf(),
        duration: _windowUnitDurations[windowUnit]
    };
}

FixedTimeWindow.check = function check(keyPrefix, windowUnit, limit, callback) {
    var keyInfo = FixedTimeWindow._calculateKeyInfo(keyPrefix, windowUnit);
    fixedWindow.check(keyInfo.key, keyInfo.duration+1, limit, callback);
};

FixedTimeWindow.count = function count(keyPrefix, windowUnit, callback) {
    var keyInfo = FixedTimeWindow._calculateKeyInfo(keyPrefix, windowUnit);
    fixedWindow.count(keyInfo.key, callback);
};

module.exports = FixedTimeWindow;