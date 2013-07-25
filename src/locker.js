var fs = require('fs'),
	util = require('util'),
	path = require('path');

var Adapter = require('./adapter'),
	Block = require('./schema/Block');

var locker = function() {

	events.EventEmitter.call(this);

	this.adapters = [];
	this.directory = "adapters";
	this.tempo = 15 * 60 * 1000; //Every 15 minutes

	this.start = function() {
		var _this = this;

		this.findAdapters();

		this.on('loaded', function() {
			_this.fetchInterval();
		});
	}

	this.add = function(callback) {
		this.adapters.push(new Adapter(callback));
	}

	this.store = function() {
		for(adapter in this.adapters) {
			Block.store(this.adapters[adapter]);
		}
	}

	this.retrieve = function(type, name, callback) {
		Block.retrieve(type, name, callback);
	}

	this.findAdapters = function() {
		fs.readdir(this.directory, function(err, files) {
			if(err)
				throw err;
			for(file in files) {
				try {
					require(packages[pkg])(this);
				} catch(e) {
					console.error("Unable to load adapter - "+ e);
					process.exit(1);
				}
			}
		});
		this.emit("loaded");
	}

	this.fetchInterval = function() {
		var _this = this;
		this.interval = setInterval(function() {
			_this.store();
		}, this.tempo);
	}
}

util.inherits(locker, events.EventEmitter);

exports.locker = locker;