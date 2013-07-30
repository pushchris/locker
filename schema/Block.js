var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlockSchema = new Schema({
    type: { type: String, required: true },
    name: { type: String },
    source: { type: String },
    content: mongoose.Schema.Types.Mixed,
    tags: { type: [String] },
    date: { type: Date, default: Date.now }
});

BlockSchema.methods.store = function(item, callback) {

    if(!callback) callback = function(){};

    var Block = this.model('Block');
    var entry = new Block(item).save(function(err, entry) {
        callback(err, entry);
    });
}

BlockSchema.statics.retrieve = function(parameters, callback) {

    if(!callback) callback = function(){};

    this.find(parameters, function(err, results) {
        callback(err, results);
    });
}

BlockSchema.statics.lastWas = function(type, source, callback) {

    if(!callback) callback = function(){};

    this.findOne({ type: type, source: source })
        .sort({date : -1}).exec(function(err, result) {
        if(err || !result) {
            callback(err, null);
        } else {
            callback(err, result.date);
        }
    });
}

module.exports = mongoose.model('Block', BlockSchema);