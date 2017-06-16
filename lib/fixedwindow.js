'use strict';

var redis = require('redis');
var async = require('async');

var FixedWindow = {};

var defaultPort = 6379;
var defaultHost = '127.0.0.1';

var redisClient;

FixedWindow.configure = function (port, host, options) {
    port = port || 6379;
    host = host || '127.0.0.1';

    redisClient = redis.createClient(port, host, options);
};

function _checkRedisClient() {
    if (!redisClient) {
        redisClient = redis.createClient(defaultPort, defaultHost);
    }
}

FixedWindow.check = function (key, windowInSeconds, limit, callback) {
    _checkRedisClient();
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
    _checkRedisClient();
    redisClient.get(key, function (err, value) {
        return callback(err, parseInt(value));
    });
};

module.exports = FixedWindow;