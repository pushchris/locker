TempoDBClient = require('tempodb').TempoDBClient,
	tempodb = new TempoDBClient(API_KEY, API_SECRET);

module.exports = function(locker) {

	var data = {};

	var fetch = function(type) {
		data[type].shift().push();
	}
	
	locker.add(function() {
		/* 
			Return content in format: 
			{ 
				name: "Vehicle Speed",
				type: "metric",
				x: 0,
				y: 0,
				xtitle: "Time",
				ytitle: "Speed",
				tags: ["vehicle", "speed", "velocity", "car"]
			}
		*/
	});

	locker.add(function() {
		/* 
			Return content in format: 
			{ 
				name: "Vehicle RPM",
				type: "metric",
				x: 0,
				y: 0,
				xtitle: "Time",
				ytitle: "Revolutions Per Minute",
				tags: ["vehicle", "rpm", "revolutions", "car"]
			}
		*/
	})

}