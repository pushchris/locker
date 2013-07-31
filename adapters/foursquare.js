/*
var config = require('../config.json'),
    Foursquare = require('node-foursquare')({
        'secrets': {
            'clientId': config.foursquare.client_id,
            'clientSecret': config.foursquare.client_secret,
            'redirectUrl': config.foursquare.redirect_url
        }
    });

*/

module.exports = function(locker) {
/*
    
    var fetch = function(date) {
        Foursquare.Checkins.getRecentCheckins({ 
            afterTimestamp: date.getTime() 
        }, config.foursquare.access_token, function(err, data) {
            console.log(data);
            var list = data.list;
            for(item in list) {
                var title = list[item].resolved_title;
                var url = list[item].resolved_url;
                var excerpt = list[item].excerpt;

                locker.add({
                    name: list[item].resolved_title,
                    source: "pocket",
                    type: "link",
                    content: {
                        url: list[item].resolved_url,
                        except: list[item].excerpt
                    },
                    tags: [list[item].favorite, list[item].resolved_id]
                });
            }
        });
    }


    locker.on("run", function() {
        locker.lastWas('link', 'pocket', function(err, date) {
            fetch(date);
        });
    });
*/
}