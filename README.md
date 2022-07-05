Rate limiting / throttling using Redis

Async/await based. For callbacks checkout v1.x.

```js
const slidingWindow = require("redis-ratelimit").slidingWindow;

for (let count = 0; count < 10; count++) {
  let limited = await slidingWindow.check("counter", 10, 2);
  if (limited) {
    // Don't do anything, wait some amount of time
    // and check rate limit again
    await timers.setTimeout(1000 * 5);
  } else {
    // Do work!
  }

  process.exit(0);
}
```

## Installation

```bash
$ npm install redis-ratelimit
```

## Features

- Provides a distributed rate limit per key
- Sliding window uses redis sorted sets for high performance
- Fixed window using simple counter with expiration

## Documentation

### configure(port, host, options)

Optionally configures the underlying redis instance used by the rate limiter.

**Arguments**

- `port` - Port redis is listening on
- `host` - Host redis is on
- `options` - Options hash passed through to underlying redis createClient() call

### fixedWindow

A fixed window rate limiter. Rate limit is applied for duration of window. Reset at window expiration. No more requests are allowed until window expires.

#### check(key, windowInSeconds, limit)

Checks if the specified key is over or under the rate limit. If over rate limit the call to check is not counted
against the rate limit

**Arguments**

- `key` - Unique key the rate limit is associated with
- `windowInSeconds` - The length of the window during which the calls are rate limited. This is a bucket
  not a sliding window. The underlying redis key expires after this duration.
- `limit` - Number of calls that are allowed before the rate limit kicks in

**Returns**

- bool - Indicates if the rate limit has kicked in or not. If an error
  occurred limited will be set to true. If limited returns true.

#### count(key)

Returns the number of calls that are currently counting against the rate limit. Note this number can be greater than the limit as each call to check increments the counter.

**Arguments**

- `key` - Unique key the rate limit is associated with

**Returns**

- int - The count of calls counting against the rate limit.

### fixedTimeWindow

A fixed time window based rate limiter. Allows a fixed number of requests per time window. i.e. 10 requests per minute

#### check(keyPrefix, windowUnit, limit)

Checks if the specified key is over or under the rate limit for the specified time window.

**Arguments**

- `keyPrefix` - Prefix for a unique key the rate limit is associated with
- `windowUnit` - The time unit for the rate limiter. Valid units:
- second
- minute
- hour
- week
- isoWeek
- month
- quarter
- year

This is a bucket not a sliding window. The underlying redis key expires after the duration of the windowUnit.

- `limit` - Number of calls that are allowed before the rate limit kicks in

**Returns**

- bool - True if the rate limit has kicked in or not. If an error
  occurred true will be returned.

#### count(key)

Returns the number of calls that are currently counting against the rate limit. Note this number can be greater than the limit as each call to check increments the counter.

**Arguments**

- `key` - Unique key the rate limit is associated with

**Returns**

- int - The count of calls counting against the rate limit.

### slidingWindow

A sliding window rate limiter. Individual requests are expired out based on request time. Once oldest request expires a new request will be allowed to occur.

#### check(key, windowInSeconds, limit)

Checks if the specified key is over or under the rate limit. If over rate limit the call to check is not counted against the rate limit

**Arguments**

- `key` - Unique key the rate limit is associated with
- `windowInSeconds` - The length of the window during which the calls are rate limited. This is not a bucket
  but a sliding window
- `limit` - Number of calls that are allowed before the rate limit kicks in

**Returns**

- bool - True if the rate limit has kicked in or not. If an error
  occurred return will be true. If true is returned the call to check() does not count against
  the rate limit.

#### count(key)

Returns the number of calls that are currently counting against the rate limit.

**Arguments**

- `key` - Unique key the rate limit is associated with

**Returns**

- int - The count of calls counting against the rate limit.

## People

The author is [Chris Kinsman](https://github.com/chriskinsman)

## License

[MIT](LICENSE)
