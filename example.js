var async = require('async');
var ratelimit = require('./index');

var count = 0;
async.doWhilst(function(done) {
    ratelimit.check('counter', 10, 2, function(err, limited) {
        if(limited)
        {
            console.info(new Date().toISOString() + ':Rate limited');
            ratelimit.count('counter', function(err, count) {
                console.info("Calls counting against limit: " + count);
            });
            setTimeout(done, 1000*5);
        }
        else
        {
            count++;
            console.info(new Date().toISOString() + ':Count ' + count);
            done();
        }
    })
}, function() {
    return count < 10;
}, function(err) {
    console.info(new Date().toISOString() + ':Done');
    process.exit(0);
});