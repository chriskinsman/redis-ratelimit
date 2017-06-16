'use strict';

var RedisClient = require('./redisclient');
var async = require('async');

var SlidingWindow = {};

function _expire(key, windowInSeconds, callback) {
    var redisClient = RedisClient.getRedisClient();

    var now = new Date().getTime();
    var expires = now - (windowInSeconds * 1000);

    redisClient.zremrangebyscore(key, '-inf', expires, callback);
}

function _getCardinality(key, callback) {
    var redisClient = RedisClient.getRedisClient();
    redisClient.zcard(key, callback);
}

function _addCall(key, callback) {
    var redisClient = RedisClient.getRedisClient();
    var now = new Date().getTime();
    redisClient.zadd(key, now, now, callback);
}

SlidingWindow.check = function (key, windowInSeconds, limit, callback) {
    async.series({
        delete: function (done) {
            _expire(key, windowInSeconds, done);
        },
        cardinality: function (done) {
            _getCardinality(key, done);
        }
    }, function (err, results) {
        // If we have an error default to limited
        if (err) {
            return callback(err, true);
        }
        else {
            if (results.cardinality < limit) {
                _addCall(key, function (err) {
                    return callback(err, false);
                });
            }
            else {
                return callback(null, true);
            }
        }
    });
};

SlidingWindow.count = function (key, callback) {
    _getCardinality(key, callback);
};

module.exports = SlidingWindow;
