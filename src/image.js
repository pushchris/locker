var papercut = require('papercut'),
    path = require('path'),
    fs = require('fs'),
    http = require('http-get'),
	config = require('../config.json');

papercut.configure(function(){
	papercut.set('storage', 's3');
	papercut.set('S3_KEY', config.s3.key);
	papercut.set('S3_SECRET', config.s3.secret);
	papercut.set('bucket', config.s3.bucket);
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

exports.process = function(url, callback) {
    if(url.indexOf("http") >= 0) {
        var tmpUrl = path.resolve(__dirname, "./" + id() + ".jpg"); 
        http.get({ url: url }, tmpUrl, function (error, result) {
            if (error) {
                callback(error, null);
            } else {
                uploader.process(id(), tmpUrl, function(err, urls) {
                    fs.unlink(tmpUrl, function() {
                        callback(err, urls);
                    }); 
                });
            }
        });
    } else {
        uploader.process(id(), path.resolve(__dirname, url), callback);
    }
}

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

function id() {
	return s4() + s4() + s4() + new Date().getTime();
}

