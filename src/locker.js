var fs = require('fs'),
	util = require('util'),
	events = require('events'),
	path = require('path'),
	mongoose = require('mongoose'),
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
	var client = redis.createClient(port, ip);
	client.aut('password');
	return client;
}

var jobs = kue.createQueue();

var Adapter = require('./adapter'),
	Block = require('../schema/Block');

var locker = function() {

	events.EventEmitter.call(this);

	this.adapters = [];
	this.directory = "adapters";
	this.tempo = 6 * 1000;
	this.startDate = new Date('1975-01-01');

	this.start = function() {
		var _this = this;

        this.on('loaded', function() {
			_this.fetchInterval();
		});
		
		this.findAdapters();
		this.workIt();
	}

	this.add = function(data) {
		job.create(data.type, data).save();
	}

	this.retrieve = function(parameters, callback) {
		Block.retrieve(parameters, callback);
	}

	this.lastWas = function(type, name, callback) {
		Block.lastWas(type, name, callback);
	}

	this.workIt = function() {
		this.children = [];
		var numCPUs = require('os').cpus().length,
			cp = require('child_process');
		for(int i = 0; i < numCPUs; i++) {
			children.push(cp.fork(__diname + '/worker.js'));
		}
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