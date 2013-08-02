var ffmpeg = requier('fluent-ffmpeg');

exports.convert = function(file, destination, progress, callback) {
	var proc = new ffmpeg({ })
	.toFormat('m4v')
	.withVideoCodec('libx264')
	.withAudioBitrate('320k')
	.withAudioCodec('libfaac')
	.onProgress(function(info) {
		progress(info.percent);
	})
	.saveToFile('/path/to/file', function(stout, sterr, err) {
		if(sterr || err)
			callback(err);
		else
			callback();
	})	
}