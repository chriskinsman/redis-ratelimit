"use strict";

const RedisClient = require("./redisclient");

const FixedWindow = {};

FixedWindow.check = async function (key, windowInSeconds, limit) {
  try {
    const redisClient = RedisClient.getRedisClient();

    const value = await redisClient.INCR(key);
    if (value === 1) {
      await redisClient.EXPIRE(key, windowInSeconds);
    }

    return value > limit;
  } catch (e) {
    console.error("fixedwindow err", e);
    return true;
  }
};

FixedWindow.count = async function (key) {
  try {
    const redisClient = RedisClient.getRedisClient();

    const value = await redisClient.GET(key);
    return parseInt(value);
  } catch (e) {
    console.error("fixedwindow err", e);
    return null;
  }
};

module.exports = FixedWindow;
