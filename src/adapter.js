var adapter = function(callback) {
	this.content = callback;

	this.retrieve = function(callback) {
		this.content(function(content) {
			callback(content);
		});
	}
}

module.exports = adapter;