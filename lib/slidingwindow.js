'use strict';

var redis = require('redis');
var async = require('async');

var SlidingWindow = {};

var defaultPort = 6379;
var defaultHost = '127.0.0.1';

var redisClient;

SlidingWindow.configure = function (port, host, options) {
    port = port || 6379;
    host = host || '127.0.0.1';

    redisClient = redis.createClient(port, host, options);
};

function _checkRedisClient() {
    if (!redisClient) {
        redisClient = redis.createClient(defaultPort, defaultHost);
    }
}

function _expire(key, windowInSeconds, callback) {
    _checkRedisClient();

    var now = new Date().getTime();
    var expires = now - (windowInSeconds * 1000);

    redisClient.zremrangebyscore(key, '-inf', expires, callback);
}

function _getCardinality(key, callback) {
    _checkRedisClient();
    redisClient.zcard(key, callback);
}

function _addCall(key, callback) {
    _checkRedisClient();
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
