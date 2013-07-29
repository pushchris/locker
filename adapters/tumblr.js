var tumblr = require('tumblr'),
    config = require('../config.json'),
    Blog = tumblr.Blog;

var oauth = {
    consumer_key: config.tumblr.consumer_key,
    consumer_secret: config.tumblr.consumer_secret,
    token: config.tumblr.token,
    token_secret: config.tumblr.tocken_secret
}
console.log(config);

var blog = new Blog(config.tumblr.site, oauth);

module.exports = function(locker) {

    var fetch = function(date, callback) {
        var index = 0,
            results = [],
            proceed = true;
        function recurse() {
            blog.photo({ limit: 20, offset: index }, function(err, blog) {
                var images = blog.posts;
                if(err) {
                    callback(err, null);
                } else if(images.length <= 0) {
                    proceed = false;
                    callback(null, results);
                } else {
                    for(i in images) {
                        if(images[i].timestamp * 1000 > date.getTime()) {
                            var photos = images[i].photos;
                            for(img in photos) {
                                results.push({
                                    name: "Tumblr Images",
                                    type: "image",
                                    content: {
                                        url: photos[img].original_size.url
                                    },
                                    tags: images[i].tags
                                });
                            }
                        } else {
                            proceed = false;
                        }
                    }
                    index += 20;
                    console.log("indexed" + index);
                    console.log(results.length);
                    recurse();
                }
            });
        }
        recurse();
    }
    
    locker.add(function(callback) {
        locker.lastWas('image', 'tumblr', function(err, date) {
            if(err || !date) {
                date = locker.startDate;
            }
            fetch(date, function(err, images) {
                console.log("img");
                console.log(images);
                console.log("es");
                callback(images);
            });
        });
    });

}