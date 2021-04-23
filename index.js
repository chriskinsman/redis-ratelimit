var RateLimit = {};

var redisClient = require('./lib/redisclient');

RateLimit.slidingWindow = require('./lib/slidingwindow');
RateLimit.fixedWindow = require('./lib/fixedwindow');
RateLimit.fixedTimeWindow = require('./lib/fixedtimewindow');

RateLimit.configure = redisClient.configure;
RateLimit.setRedisClient = redisClient.setRedisClient;

module.exports = RateLimit;