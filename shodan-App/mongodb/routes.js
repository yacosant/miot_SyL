//routes.js endpoints

var ControllerData = require ('./controllers/data.js');

module.exports = function(app) {

	//Data//
	app.get('/data/all', ControllerData.getAll);
	app.get('/data/types', ControllerData.getTypes);

}
