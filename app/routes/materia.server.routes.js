'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var materia = require('../../app/controllers/materia.server.controller');

	// Materia Routes
	app.route('/materia')
		.get(materia.list)
		.post(users.requiresLogin, materia.create);

	app.route('/materia/:materiumId')
		.get(materia.read)
		.put(users.requiresLogin, materia.hasAuthorization, materia.update)
		.delete(users.requiresLogin, materia.hasAuthorization, materia.delete);

	// Finish by binding the Materium middleware
	app.param('materiumId', materia.materiumByID);
};
