'use strict';

var RedisClient = require('./redisclient');
var async = require('async');

var FixedWindow = {};

FixedWindow.check = function (key, windowInSeconds, limit, callback) {
    var redisClient = RedisClient.getRedisClient();
    async.waterfall([
        function increment(done) {
            redisClient.incr(key, done);
        },
        function expire(value, done) {
            if (value === 1) {
                redisClient.expire(key, windowInSeconds, function (err) {
                    done(err, value);
                });
            }
            else {
                setImmediate(done, null, value);
            }
        }
    ], function (err, value) {
        // If we have an error default to limited
        if (err) {
            return callback(err, true);
        }
        else {
            if (value <= limit) {
                return callback(err, false);
            }
            else {
                return callback(null, true);
            }
        }        
    });
};

FixedWindow.count = function (key, callback) {
    var redisClient = RedisClient.getRedisClient();
    redisClient.get(key, function (err, value) {
        return callback(err, parseInt(value));
    });
};

module.exports = FixedWindow;