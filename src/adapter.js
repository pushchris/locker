var adapter = function(type, name, callback) {
	this.type = type;
	this.name = name;
	this.content = callback;

	this.retrive = function(callback) {
		this.content(function(content) {
			callback(type, name, content);
		});
	}
}