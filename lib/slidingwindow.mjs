import RedisClient from "./redisclient.mjs";

async function _expire(key, windowInSeconds) {
  const redisClient = RedisClient.getRedisClient();

  const now = new Date().getTime();
  const expires = now - windowInSeconds * 1000;

  return redisClient.ZREMRANGEBYSCORE(key, "-inf", expires);
}

async function _getCardinality(key) {
  const redisClient = RedisClient.getRedisClient();
  return redisClient.ZCARD(key);
}

async function _addCall(key) {
  const redisClient = RedisClient.getRedisClient();
  const now = new Date().getTime();
  return redisClient.ZADD(key, [{ score: now, value: now + "" }]);
}

async function check(key, windowInSeconds, limit) {
  try {
    await _expire(key, windowInSeconds);
    const cardinality = await _getCardinality(key);

    if (cardinality < limit) {
      await _addCall(key);
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.error("slidingwindow err:", e);
    return true;
  }
}

async function count(key) {
  return _getCardinality(key);
}

export default { check, count };
