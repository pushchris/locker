var papercut = require('papercut'),
	config = require('./config.js');

papercut.configure('production', function(){
	papercut.set('storage', 's3');
	papercut.set('S3_KEY', config.S3_KEY);
	papercut.set('S3_SECRET', config.S3_SECRET);
	papercut.set('bucket', config.S3_BUCKET);
});

var Uploader = papercut.Schema(function(schema){
	schema.version({
		name: 'thumbnail',
		size: '100x100',
		process: 'crop'
	});

	schema.version({
		name: 'small',
		size: '320x240',
		process: 'resize'
	});

	schema.version({
		name: 'medium',
		size: '640x480',
		process: 'resize'
	});

	schema.version({
		name: 'large',
		size: '1280x960',
		process: 'resize'
	});

	schema.version({
		name: 'original',
		process: 'copy'
	});
});

var uploader = new Uploader();

exporter.process = function(url, callback) {
	uploader.process(id(), url, callback);
}

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

function id() {
	return s4() + s4() + s4() + new Date.getTime();
}

