var fs = require('fs'),
	util = require('util'),
	events = require('events'),
	path = require('path'),
	mongoose = require('mongoose'),
	config = require('../config.json');
	
var db = mongoose.connect(config.uristring, function (err, res) {
	if (err)
		console.error('ERROR connecting to: ' + config.uristring + '. ' + err);
	else
		console.log('Succeeded connected to: ' + config.uristring);
});

var Adapter = require('./adapter'),
	Image = require('./image'),
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
	}

	this.add = function(callback) {
		this.adapters.push(new Adapter(callback));
	}

	this.store = function() {
		for(i in this.adapters) {
			this.adapters[i].retrieve(function(content) {
			    var block = new Block();
				if(Array.isArray(content)) {
					for(item in content) {
						process(content[item], function(err, content) {
							block.store(content);
						})
					}
				} else {
					process(content, function(err, content) {
						block.store(content);
					});
				}
			});
		}
		function process(content, callback) {
			if(content.type == "image") {
				Image.process(content.content.url, function(err, urls) {
					content.content.url = urls;
					callback(err, content);
				});
			} else {
				callback(null, content);
			}
		}
	}

	this.retrieve = function(type, name, callback) {
		Block.retrieve(type, name, callback);
	}

	this.lastWas = function(type, name, callback) {
		Block.lastWas(type, name, callback);
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
			_this.store();
		}, this.tempo);
	}
}

util.inherits(locker, events.EventEmitter);

module.exports = locker;