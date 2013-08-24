
var instagram = require('instagram-node-lib'),
    config = require('../config.json');

instagram.set('client_id', config.instagram.client_id);
instagram.set('client_secret', config.instagram.client_secret);
instagram.set('access_token', config.instagram.access_token);


module.exports = function(locker) {

    var fetch = function(date) {
        instagram.users.search({
            q: config.instagram.username,
            complete: function(data) { 
                instagram.users.recent({
                    user_id: data[0].id,
                    min_timestamp: date.getTime(),
                    count: 50,
                    complete: function(data) {
                        console.log(data.length);
                        for(image in data) {
                            if(data[image].type == "image" && data[image].created_time * 1000 > date.getTime()) {
                                locker.add({ 
                                    name: data[image].id,
                                    source: "instagram",
                                    type: "image",
                                    content: {
                                        url: data[image].images.standard_resolution.url
                                    },
                                    tags: []
                                });
                                locker.add({
                                    name: data[image].id,
                                    source: "instagram",
                                    type: "location",
                                    content: data[image].location
                                });
                            } 
                        }
                    }
                });
            }
        });
    }


    locker.on("run", function() {
        locker.lastWas('image', 'instagram', function(err, date) {
            console.log(date);
            fetch(date);
        });
    });
}