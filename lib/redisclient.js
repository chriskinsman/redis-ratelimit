"use strict";

const redis = require("redis");

const RedisClient = {};

const defaultPort = 6379;
const defaultHost = "127.0.0.1";

let redisClient;

RedisClient.configure = function configure(port, host, options) {
  port = port || 6379;
  host = host || "127.0.0.1";

  redisClient = redis.createClient({
    url: `redis://${defaultHost}:${defaultPort}`,
    options: options,
  });
  redisClient.connect();
};

RedisClient.getRedisClient = function getRedisClient() {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: `redis://${defaultHost}:${defaultPort}`,
    });
    redisClient.connect();
  }

  return redisClient;
};

RedisClient.close = function close() {
  redisClient.quit();
};

module.exports = RedisClient;
