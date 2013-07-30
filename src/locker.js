var fs = require('fs'),
	util = require('util'),
	events = require('events'),
	path = require('path'),
	mongoose = require('mongoose'),
	redis = require('redis'),
	kue = require('kue'),
	config = require('../config.json');
	
var db = mongoose.connect(config.uristring, function (err, res) {
	if (err) {
		console.error('ERROR connecting to: ' + config.uristring + '. ' + err);
	} else {
		console.log('Succeeded connected to: ' + config.uristring);
	}
});

kue.redis.createClient = function() {
	var client = redis.createClient(config.redis.port, config.redis.ip);
	return client;
}

kue.app.listen(4400);

var jobs = kue.createQueue();

var Adapter = require('./adapter'),
	Block = require('../schema/Block');

var locker = function() {

	events.EventEmitter.call(this);

	this.adapters = [];
	this.directory = "adapters";
	this.tempo = 6 * 1000;
	this.startDate = new Date(0); //Earliest date possible

	this.start = function() {
		var _this = this;

        this.on('loaded', function() {
			_this.fetchInterval();
		});
		
		this.findAdapters();
		this.workIt();
	}

	this.add = function(data) {
		jobs.create(data.type, data).attempts(5).save();
	}

	this.retrieve = function(parameters, callback) {
		Block.retrieve(parameters, callback);
	}

	this.lastWas = function(type, source, callback) {
		Block.lastWas(type, source, function(err, date) {
			if(err || !date) {
                date = locker.startDate;
            }
            callback(err, date);
		});
	}

	this.workIt = function() {
		this.children = [];
		var numCPUs = require('os').cpus().length,
			cp = require('child_process');
		//for(var i = 0; i < numCPUs; i++) {
			//this.children.push(cp.fork(__dirname + '/worker.js'));
		//}
	}

	this.findAdapters = function() {
	    var _this = this,
	        i = 0;
		fs.readdir(this.directory, function(err, files) {
			if(err)
				throw err;
			for(file in files) {
				try {
					require("../" + _this.directory + "/" + files[file])(_this);
				} catch(e) {
					console.error("Unable to load adapter - "+ e);
					process.exit(1);
				}
				if(++i >= files.length)
				    _this.emit("loaded");
			}
		});
	}

	this.fetchInterval = function() {
		var _this = this;
		this.interval = setTimeout(function() {
			_this.emit("run");
		}, this.tempo);
	}
}

util.inherits(locker, events.EventEmitter);

module.exports = locker;