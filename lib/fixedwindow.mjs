import RedisClient from "./redisclient.mjs";

async function check(key, windowInSeconds, limit) {
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
}

async function count(key) {
  try {
    const redisClient = RedisClient.getRedisClient();

    const value = await redisClient.GET(key);
    return parseInt(value);
  } catch (e) {
    console.error("fixedwindow err", e);
    return null;
  }
}

export default { count, check };
