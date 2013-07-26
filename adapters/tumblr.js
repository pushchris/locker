var tumblr = require('tumblr'),
    config = require('../config.json'),
    Blog = tumblr.Blog;

var oauth = {
    consumer_key = config.tumblr.consumer_key,
    consumer_secret: config.tumblr.consumer_secret,
    token: config.tumblr.token,
    token_secret: config.tumblr.tocken_secret
}

var blog = new Blog(config.tumblr.site, oauth);

module.exports = function(locker) {

    var data = {};

    var fetch = function(date, callback) {
        var index = 0,
            results = [],
            proceed = true;
        if(proceed) {
            blog.photo({ limit: 20, index: index }, function(err, images) {
                if(err) {
                    proceed = false;
                    callback(err, null);
                } else {
                    for(i in images) {
                        if(images[i].timestamp > date) {
                            //Do some formatting of the results
                            results.push(images[i]);
                        } else {
                            proceed = false;
                        }
                    }
                    index += 20;
                }
            });
        } else {
            callback(results);
        }
        
    }
    
    locker.add(function(callback) {
        locker.lastWas('image', 'tumblr', function(date) {
            fetch(date, function(images) {
                callback(images);
            });
        });
    });

}