'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var parcials = require('../../app/controllers/parcials.server.controller');

	// Parcials Routes
	app.route('/parcials')
		.get(parcials.list)
		.post(users.requiresLogin, parcials.create);

	app.route('/parcials/:parcialId')
		.get(parcials.read)
		.put(users.requiresLogin, parcials.hasAuthorization, parcials.update)
		.delete(users.requiresLogin, parcials.hasAuthorization, parcials.delete);

	// Finish by binding the Parcial middleware
	app.param('parcialId', parcials.parcialByID);
};
