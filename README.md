
  Rate limiting / throttling based using Redis

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Build Status][travis-image]][travis-url]

```js
var ratelimit = require('redis-ratelimit')
var async = require('async')

var count = 0;
async.doWhilst(function(done) {
    ratelimit.check('counter', 10, 2, function(err, limited) {
        if(limited)
        {
            // Don't do anything, wait some amount of time
            // and check rate limit again
            setTimeout(done, 1000*5);
        }
        else
        {
            // Do work
            count++;
            done();
        }
    })
}, function() {
    return count < 10;
}, function(err) {
    // Done
    process.exit(0);
});

```

## Installation

```bash
$ npm install redis-ratelimit
```

## Features

  * Provides a distributed rate limit per key
  * Redis sorted sets used for high performance

## Documentation

### configure(port, host, options)

Optionally configures the underlying redis instance used by the rate limiter.

__Arguments__

* `port` - Port redis is listening on
* `host` - Host redis is on
* `options` - Options hash passed through to underlying redis createClient() call

### check(key, windowInSeconds, limit, callback)

Checks if the specified key over or under the rate limit.  If over rate limit the call to check is not counted
against the rate limit

__Arguments__

* `key` - Unique key the rate limit is associated with
* `windowInSeconds` - The length of the window during which the calls are rate limited.  This is not a bucket
but a sliding window
* `limit` - Number of calls that are allowed before the rate limit kicks in
* `callback(err, limited)` - A callback which indicates if the rate limit has kicked in or not.  If an error
occurred limited will be set to true.  If limited returns true the call to check() does not count against
the rate limit.

## People

The author is [Chris Kinsman](https://github.com/chriskinsman)

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express.svg?style=flat
[npm-url]: https://npmjs.org/package/express
[downloads-image]: https://img.shields.io/npm/dm/express.svg?style=flat
[downloads-url]: https://npmjs.org/package/express
[travis-image]: https://img.shields.io/travis/strongloop/express.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/express
[coveralls-image]: https://img.shields.io/coveralls/strongloop/express.svg?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/express?branch=master
[gratipay-image-visionmedia]: https://img.shields.io/gratipay/visionmedia.svg?style=flat
[gratipay-url-visionmedia]: https://gratipay.com/visionmedia/
[gratipay-image-dougwilson]: https://img.shields.io/gratipay/dougwilson.svg?style=flat
[gratipay-url-dougwilson]: https://gratipay.com/dougwilson/