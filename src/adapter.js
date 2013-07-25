var adapter = function(callback) {
	this.content = callback;

	this.retrive = function(callback) {
		this.content(function(content) {
			callback(content);
		});
	}
}