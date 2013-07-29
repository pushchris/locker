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

    var fetch = function(date) {
        var index = 0,
            proceed = true;
        function recurse() {
            blog.photo({ limit: 20, offset: index }, function(err, blog) {
                var images = blog.posts;
                if(err || images.length <= 0) {
                    proceed = false;
                } else {
                    for(i in images) {
                        if(images[i].timestamp * 1000 > date.getTime()) {
                            var photos = images[i].photos;
                            for(img in photos) {
                                locker.add({
                                    name: "Tumblr Images",
                                    source: "tumblr",
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
                    recurse();
                }
            });
        }
        recurse();
    }

    locker.on("run", function() {
        locker.lastWas('image', 'tumblr', function(err, date) {
            if(err || !date) {
                date = locker.startDate;
            }
            fetch(date);
        });
    });
}