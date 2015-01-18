var assert = require('assert');
var ratelimit = require('./../index');
var async = require('async');

describe('Rate Limit', function(){
    it ('should rate limit', function(done){
        this.timeout(4000);
        var count=0;
        var rateLimited = false;
        async.doWhilst(function(done) {
            ratelimit.check('test1', 2, 2, function(err, limited) {
                if(limited)
                {
                    console.info("Rate Limited");
                    rateLimited = true;
                    setTimeout(done,1000);
                }
                else
                {
                    console.info("Count");
                    count++;
                    done();
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
        async.doWhilst(function(done) {
            ratelimit.check('test2', 2, 2, function(err, limited) {
                if(limited)
                {
                    console.info("Rate Limited");
                    rateLimited = true;
                    done();
                }
                else
                {
                    console.info("Count");
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