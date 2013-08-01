
var instagram = require('instagram-node-lib'),
    config = require('../config.json');

instagram.set('client_id', config.instagram.client_id);
instagram.set('client_secret', config.instagram.client_secret);
instagram.set('access_token', config.instagram.access_token);


module.exports = function(locker) {

15328905

    var fetch = function(date) {
        instagram.users.search({
            q: 'chrisanderson93',
            complete: function(data) { 
                instagram.users.recent({
                    user_id: data[0].id,
                    min_timestamp: date.getTime(),
                    count: 50,
                    complete: function(data) {
                        console.log(data.length);
                        for(image in data) {
                            //console.log(data[image].images.standard_resolution.url);
                            if(data[image].type == "image") {
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