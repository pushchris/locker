var ffmpeg = require('fluent-ffmpeg'),
    path = require('path');

exports.convert = function(file, destination, progress, callback) {
    file = path.resolve(__dirname, "./" + file);
    destination = path.resolve(__dirname, "./" + destination);  
    console.log(destination);
	var proc = new ffmpeg({ source: file, timeout: false })
	.toFormat('mp4')
	.withVideoCodec('libx264')
	.withVideoBitrate('1500k')
	.withAudioBitrate('128k')
	.withAudioCodec('libfaac')
	.onProgress(function(info) {
		progress(parseInt(info.percent));
	})
	.saveToFile(destination, function(stout, sterr, err) {
		if(sterr || err)
			callback(err);
		else
			callback();
	})	
}