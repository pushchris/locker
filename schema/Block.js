var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BlockSchema = new Schema({
    type: { type: String, required: true },
    name: { type: String },
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

BlockSchema.methods.retrieve = function(type, name, callback) {

    if(!callback) callback = function(){};

    this.model('Block').find({ type: type, name: name }, function(err, results) {
        callback(err, results);
    });
}

BlockSchema.methods.lastWas = function(type, name, callback) {

    if(!callback) callback = function(){};

    this.model('Block').findOne({ type: type, name: name })
        .sort({date : -1}).exec(function(err, result) {
        if(err) {
            callback(err, null);
        } else {
            callback(err, result.date);
        }
    });
}

module.exports = mongoose.model('Block', BlockSchema);