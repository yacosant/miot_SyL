//routes.js endpoints

var ControllerData = require ('./controllers/data.js');
var ControllerVul = require ('./controllers/vulnerable.js');

module.exports = function(app) {

	//Data//
	app.get('/data/all', ControllerData.getAll);
	app.get('/data/types', ControllerData.getTypes);
	app.get('/vul/all', ControllerVul.getAll);
	
}
