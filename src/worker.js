var kue = require('kue'),
	redis = require('redis'),
	mongoose = require('mongoose'),
	image = require('./image'),
	config = require('../config.json'),
	Block = require('../schema/Block');

kue.redis.createClient = function() {
	var client = redis.createClient(config.redis.port, config.redis.ip);
	return client;
}

var db = mongoose.connect(config.uristring, function (err, res) {
	if (err) {
		console.error('ERROR connecting to: ' + config.uristring + '. ' + err);
	} else {
		console.log('Succeeded connected to: ' + config.uristring);
	}
});

var jobs = kue.createQueue();

jobs.process('image', function(job, callback) {
    var block = new Block();
	try {
    	image.process(job.data.content.url, function(err, urls) {
    		job.data.content.url = urls;
    		block.store(job.data, function(err, entry) {
                console.error(err);
                if (err) return done(err);
                callback();
    		});
    	});
    } catch(err) {
        console.log("THERE WAS AN ERROR");
        console.log(job.data.content.url);
        console.error(err);
    }
});

jobs.process('metric', 20, function(job, callback) {
	new Block().store(job.data);
	callback();
});

jobs.process('location', 20, function(job, callback) {
	new Block().store(job.data);
	callback();
});