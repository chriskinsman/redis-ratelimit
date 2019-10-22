var assert = require('assert');
var fixedTimeWindow = require('./../index').fixedTimeWindow;
var async = require('async');
var uuid = require('uuid/v4');
var moment = require('moment');

describe('Time Window Keys', function () {
    it('second', function (done) {
        var keyInfo = fixedTimeWindow._calculateKeyInfo(uuid(), 'second');
        assert.equal(keyInfo.duration, 1);
        setImmediate(done);
    });

    it('minute', function (done) {
        var unit = 'minute';
        var keyPrefix = uuid();
        var key = keyPrefix + ':' + moment().startOf(unit);
        var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
        assert.equal(keyInfo.duration, 60);
        assert.equal(keyInfo.key, key);
        setImmediate(done);
    });

    it('hour', function (done) {
        var unit = 'hour';
        var keyPrefix = uuid();
        var key = keyPrefix + ':' + moment().startOf(unit);
        var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
        assert.equal(keyInfo.duration, 60 * 60);
        assert.equal(keyInfo.key, key);
        setImmediate(done);
    });

    it('day', function (done) {
        var unit = 'day';
        var keyPrefix = uuid();
        var key = keyPrefix + ':' + moment().startOf(unit);
        var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
        assert.equal(keyInfo.duration, 24 * 60 * 60);
        assert.equal(keyInfo.key, key);
        setImmediate(done);
    });

    it('week', function (done) {
        var unit = 'week';
        var keyPrefix = uuid();
        var key = keyPrefix + ':' + moment().startOf(unit);
        var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
        assert.equal(keyInfo.duration, 7 * 24 * 60 * 60);
        assert.equal(keyInfo.key, key);
        setImmediate(done);
    });

    it('month', function (done) {
        var unit = 'month';
        var keyPrefix = uuid();
        var key = keyPrefix + ':' + moment().startOf(unit);
        var keyInfo = fixedTimeWindow._calculateKeyInfo(keyPrefix, unit);
        assert.equal(keyInfo.duration, 31 * 24 * 60 * 60);
        assert.equal(keyInfo.key, key);
        setImmediate(done);
    });    
});

describe('Time Window Rate Limit', function () {
    it('second should rate limit', function (done) {
        this.timeout(4000);
        var count = 0;
        var rateLimited = false;
        var key = uuid();
        async.doWhilst(function (done) {
            fixedTimeWindow.check(key, 'second', 1, function (err, limited) {
                count++;
                if (limited) {
                    console.info("Rate Limited");
                    rateLimited = true;
                    process.nextTick(done);
                }
                else {
                    console.info("Count");
                    process.nextTick(done);
                }
            });
        }, function (done) { setImmediate(done, null, count < 3); }, function (err) {
            assert(rateLimited, 'Not rate limited');
            done();
        });
    });

    it('second should not rate limit', function (done) {
        this.timeout(4000);
        var count = 0;
        var rateLimited = false;
        var key = uuid();
        async.doWhilst(function (done) {
            fixedTimeWindow.check(key, 'second', 1, function (err, limited) {
                count++;
                if (limited) {
                    rateLimited = true;
                    process.nextTick(done);
                }
                else {
                    console.info("Count");
                    setTimeout(done, 1100);
                }
            });
        }, function (done) { setImmediate(done, null, count < 3); }, function (err) {
            assert(!rateLimited, 'Rate limited');
            done();
        });
    });

});

