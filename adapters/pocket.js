/*
try {
var Pocket = require('node-pocket'),
    config = require('../config.json'),
    pocket = new Pocket(config.pocket.consumer_key);
}catch(e) {
    console.log(e);
}
*/


module.exports = function(locker) {
/*

    console.log(config);
    console.log(pocket);
    pocket.getRequestToken({ url: "http://127.0.0.1:8080/get-access-token" }, function(err, result) {
        console.log(result);
    });
    
*/
    
    /*
var fetch = function(date) {
        pocket.get({ since: date.getTime() }, function(err, data) {
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