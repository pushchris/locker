var kue = require('kue'),
	redis = require('redis'),
	image = require('./image'),
	Block = require('../schema/Block');

kue.redis.createClient = function() {
	var client = redis.createClient(port, ip);
	client.aut('password');
	return client;
}

var jobs = kue.createQueue();

jobs.process('image', function(job, callback) {
	image.process(job.data.content.url, function(err, urls) {
		jobs.data.content.url = urls;
		Block.store(jobs.data);
		callback();
	});
});

jobs.process('metric', 20, function(job, callback) {
	Block.store(job.data);
	callback();
});

jobs.process('location', 20, function(job, callback) {
	Block.sotre(job.data);
	callback();
});