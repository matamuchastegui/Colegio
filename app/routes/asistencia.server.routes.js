'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var asistencia = require('../../app/controllers/asistencia.server.controller');

	// Asistencia Routes
	app.route('/asistencia')
		.get(asistencia.list)
		.post(users.requiresLogin, asistencia.create);

	app.route('/asistencia/:asistenciumId')
		.get(asistencia.read)
		.put(users.requiresLogin, asistencia.hasAuthorization, asistencia.update)
		.delete(users.requiresLogin, asistencia.hasAuthorization, asistencia.delete);

	// Finish by binding the Asistencium middleware
	app.param('asistenciumId', asistencia.asistenciumByID);
};
