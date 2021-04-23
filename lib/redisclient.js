'use strict';

var redis = require('redis');

var RedisClient = {};

var defaultPort = 6379;
var defaultHost = '127.0.0.1';

var redisClient;

RedisClient.configure = function configure(port, host, options) {
    port = port || 6379;
    host = host || '127.0.0.1';

    redisClient = redis.createClient(port, host, options);
};

RedisClient.getRedisClient = function getRedisClient() {
    if (!redisClient) {
        redisClient = redis.createClient(defaultPort, defaultHost);
    }

    return redisClient;
}

RedisClient.setRedisClient = function setRedisClient(client) {
    redisClient = client;
}

module.exports = RedisClient;