//routes.js endpoints

var ControllerShodan = require ('./controllers/shodan.js');

module.exports = function(app) {
	app.post('/get', ControllerShodan.get);
	app.post('/play', ControllerShodan.play);
	
}