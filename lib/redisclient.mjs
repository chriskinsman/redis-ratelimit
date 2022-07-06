import redis from "redis";

const defaultPort = 6379;
const defaultHost = "127.0.0.1";

let redisClient;

function configure(port, host, options) {
  port = port || 6379;
  host = host || "127.0.0.1";

  redisClient = redis.createClient({
    url: `redis://${defaultHost}:${defaultPort}`,
    options: options,
  });
  redisClient.connect();
}

function getRedisClient() {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: `redis://${defaultHost}:${defaultPort}`,
    });
    redisClient.connect();
  }

  return redisClient;
}

function close() {
  if (redisClient) {
    redisClient.quit();
  }
}

export default { configure, getRedisClient, close };
