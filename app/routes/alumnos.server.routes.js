'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var alumnos = require('../../app/controllers/alumnos.server.controller');
	var comentarios = require('../../app/controllers/comentarios.server.controller');

	// Alumnos Routes
	app.route('/alumnos')
		.get(alumnos.list)
		.get(comentarios.list)
		.post(users.requiresLogin, alumnos.create);

	app.route('/alumnos/:alumnoId')
		.get(alumnos.read)
		.put(users.requiresLogin, alumnos.hasAuthorization, alumnos.update)
		.delete(users.requiresLogin, alumnos.hasAuthorization, alumnos.delete);

	// Finish by binding the Alumno middleware
	app.param('alumnoId', alumnos.alumnoByID);
};
