var fs = require('fs'),
	path = require('path');

var Adapter = require('./adapter'),
	Block = require('./schema/Block');

var locker = function() {

	this.adapters = [];
	this.directory = "adapters";

	this.start = function() {
		this.findAdapters();
	}

	this.add = function(type, name, callback) {
		this.adapters.push(new Adapter(type, name, callback));
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
	}
}

exports.locker = locker;