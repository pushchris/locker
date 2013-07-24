var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BlockSchema = new Schema({
	type: { type: String, required: true },
	name: { type: String },
	content: mongoose.Schema.Types.Mixed
});

BlockSchema.methods.store = function(adapter, callback) {

	if(!callback) callback = function(){};

	var Block = this.model('Block');
	var entry;

	adapter.retrieve(function(type, name, content) {
		entry = new Block({
			type: type,
			name: name,
			content: content
		});
		entry.save(function(err, entry) {
			callback(err, entry);
		});
	});
}

BlockSchema.methods.retrieve = function(type, name, callback) {

	if(!callback) callback = function(){};

	this.model('Block').find({ type: type, name: name }, function(err, results) {
		callback(err, results);
	});
}

module.exports = mongoose.model('Block', BlockSchema);