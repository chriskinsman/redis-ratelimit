var RateLimit = {};

RateLimit.slidingWindow = require('./lib/slidingwindow');
RateLimit.fixedWindow = require('./lib/fixedwindow');

module.exports = RateLimit;