//routes.js endpoints

var ControllerShodan = require ('./controllers/shodan.js');

module.exports = function(app) {
	app.get('/get', ControllerShodan.get);
	
}