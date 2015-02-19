'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var comentarios = require('../../app/controllers/comentarios.server.controller');
	var alumnos = require('../../app/controllers/alumnos.server.controller');

	// Comentarios Routes
	app.route('/comentarios')
		.get(comentarios.list)
		.post(users.requiresLogin, comentarios.create);

	/*app.route('/comentarios/:comentarioId')
		.get(comentarios.read)
		.put(users.requiresLogin, comentarios.hasAuthorization, comentarios.update)
		.delete(users.requiresLogin, comentarios.hasAuthorization, comentarios.delete);*/

	/*app.route('/comentarios/:alumnoId')
		.get(comentarios.list3)
		.put(users.requiresLogin, comentarios.create);
	*/	
	// Finish by binding the Comentario middleware
	app.param('comentarioId', comentarios.comentarioByID);
	//app.param('alumnoId', alumnos.alumnoByID);
};
