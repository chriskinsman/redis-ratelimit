'use strict';

var redis = require('redis');
var async = require('async');

var RateLimit = {};

var defaultPort = 6379;
var defaultHost = '127.0.0.1';

var redisClient;

RateLimit.configure = function(port, host, options) {
    port = port || 6379;
    host = host || '127.0.0.1';

    redisClient = redis.createClient(port, host, options);
};

RateLimit.check = function(key, windowInSeconds, limit, callback) {
    if(!redisClient)
    {
        redisClient = redis.createClient(defaultPort, defaultHost);
    }

    var now = new Date().getTime();
    var expires = now - (windowInSeconds * 1000);

    async.series({
        delete: function(done) {
            redisClient.zremrangebyscore(key, '-inf', expires, done);
        },
        cardinality: function(done) {
            redisClient.zcard(key, done);
        }
    }, function(err, results) {
        // If we have an error default to limited
        if(err)
        {
            return callback(err, true);
        }
        else
        {
            if(results.cardinality < limit)
            {
                redisClient.zadd(key, now, now, function(err) {
                    return callback(null, false)
                });
            }
            else
            {
                return callback(null, true);
            }
        }
    });
};

module.exports = RateLimit;
