var kue = require('kue'),
	redis = require('redis'),
	mongoose = require('mongoose'),
	image = require('./image'),
	video = require('./video'),
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

jobs.process('image', 2, function(job, callback) {
    var block = new Block();
	try {
    	image.process(job.data.content.url, function(err, urls) {
    		if (err) return callback(err);
    		job.data.content.url = urls;
    		block.store(job.data, function(err, entry) {
                if (err) return callback(err);
                callback();
    		});
    	});
    } catch(err) {
        console.log("THERE WAS AN ERROR");
        console.log(job.data.content.url);
        console.error(err);
        callback(err);
    }
});

jobs.process('video', function(job, callback) {
	var block = new Block();
	try {
		video.convert(
			job.data.content.url, 
			job.data.content.destination, 
			function(percent) {
				job.progress(percent, 100);
			}, 
			function(err) {
				if(err) return callback(err);
				job.data.content.url = job.data.content.destination;
				delete job.data.content.destination;
				block.store(job.data, function(err, entry) {
					if(err) return callback(err);
					callback();
				});
			}
		);
	} catch(err) {
		callback(err);
	}
});

jobs.process('metric', 20, function(job, callback) {
	new Block().store(job.data, function(err, entry) {
		if (err) return callback(err);
		callback();
	});
});

jobs.process('location', 20, function(job, callback) {
	new Block().store(job.data, function(err, entry) {
		if (err) return callback(err);
		callback();
	});
});

jobs.process('link', 20, function(job, callback) {
	new Block().store(job.data, function(err, entry) {
		if (err) return callback(err);
		callback();
	});
});