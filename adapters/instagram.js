/*
var instagram = require('instagram-node-lib'),
    config = require('../config.json');

instagram.set('client_id', config.instagram.client_id);
instagram.set('client_secret', config.instagram.client_secret);
instagram.set('access_token', config.instagram.access_token);
*/

module.exports = function(locker) {
/*

    var fetch = function(date) {
        instagram.users.self({
            complete: function(data) {
                console.log(data);
                /*
                locker.add({ 
                    name: "mine",
                    source: "instagram",
                    type: "image",
                    content: {
                        url: data.url
                    },
                    tags: []
                });

                locker.add({
                    name: "photos at",
                    source: "instagram",
                    type: "location",
                    content: {
                        id: 697945,
                        latitude: -87.089834,
                        longitude: 103.12312
                    }
                })

                
            }
        });
    }


    locker.on("run", function() {
        locker.lastWas('image', 'instagram', function(err, date) {
            if(err || !date) {
                date = locker.startDate;
            }
            fetch(date);
        });
    });
*/
}