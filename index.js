var RateLimit = {};

var redisClient = require('./lib/redisclient');

RateLimit.slidingWindow = require('./lib/slidingwindow');
RateLimit.fixedWindow = require('./lib/fixedwindow');
RateLimit.fixedTimeWindow = require('./lib/fixedtimewindow');

RateLimit.configure = redisClient.configure;

module.exports = RateLimit;