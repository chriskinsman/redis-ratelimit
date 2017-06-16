var assert = require('assert');
var ratelimit = require('./../index').slidingWindow;
var async = require('async');
var uuid = require('uuid/v4');

describe('Sliding Window', function(){
    it ('should rate limit', function(done){
        this.timeout(4000);
        var count=0;
        var rateLimited = false;
        var key = uuid();
        async.doWhilst(function(done) {
            ratelimit.check(key, 2, 2, function(err, limited) {
                if(limited)
                {
                    //console.info("Rate Limited");
                    rateLimited = true;
                    setTimeout(done,1000);
                }
                else
                {
                    //console.info("Count");
                    count++;
                    process.nextTick(done);
                }
            });
        }, function() { return count < 3;},function(err) {
            assert(rateLimited, 'Did not rate limit');
            done();
        });
    });
    it ('should not rate limit', function(done) {
        this.timeout(4000);
        var count=0;
        var rateLimited = false;
        var key = uuid();
        async.doWhilst(function(done) {
            ratelimit.check(key, 2, 2, function(err, limited) {
                if(limited)
                {
                    //console.info("Rate Limited");
                    rateLimited = true;
                    process.nextTick(done);
                }
                else
                {
                    //console.info("Count");
                    count++;
                    setTimeout(done, 1000);
                }
            });
        }, function() { return count < 3;},function(err) {
            assert(!rateLimited, 'Rate limited');
            done();
        });
    });
});