var assert = require('assert');
var ratelimit = require('./../index').fixedWindow;
var async = require('async');
var uuid = require('uuid/v4');

describe('Fixed Window', function () {
    it('should rate limit', function (done) {        
        this.timeout(4000);
        var count = 0;
        var rateLimited = false;
        var key = uuid();
        async.doWhilst(function (done) {
            ratelimit.check(key, 3, 2, function (err, limited) {
                count++;
                if (limited) {
                    //console.info("Rate Limited");
                    rateLimited = true;
                    process.nextTick(done);
                }
                else {
                    //console.info("Count");                    
                    process.nextTick(done);
                }
            });
        }, function (done) { setImmediate(done, null, count < 3); }, function (err) {
            assert(rateLimited, 'Did not rate limit');
            done();
        });
    });
    it('should not rate limit', function (done) {
        this.timeout(4000);
        var count = 0;
        var rateLimited = false;
        var key = uuid();
        async.doWhilst(function (done) {
            ratelimit.check(key, 3, 3, function (err, limited) {
                count++;
                if (limited) {
                    //console.info("Rate Limited");
                    rateLimited = true;
                    process.nextTick(done);
                }
                else {
                    //console.info("Count");
                    process.nextTick(done);
                }
            });
        }, function (done) { setImmediate(done, null, count < 3); }, function (err) {
            assert(!rateLimited, 'Rate limited');
            done();
        });
    });
});