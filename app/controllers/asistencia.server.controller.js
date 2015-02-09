'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Asistencium = mongoose.model('Asistencium'),
	_ = require('lodash');

/**
 * Create a Asistencium
 */
exports.create = function(req, res) {
	var asistencium = new Asistencium(req.body);
	asistencium.user = req.user;

	asistencium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(asistencium);
		}
	});
};

/**
 * Show the current Asistencium
 */
exports.read = function(req, res) {
	res.jsonp(req.asistencium);
};

/**
 * Update a Asistencium
 */
exports.update = function(req, res) {
	var asistencium = req.asistencium ;

	asistencium = _.extend(asistencium , req.body);

	asistencium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(asistencium);
		}
	});
};

/**
 * Delete an Asistencium
 */
exports.delete = function(req, res) {
	var asistencium = req.asistencium ;

	asistencium.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(asistencium);
		}
	});
};

/**
 * List of Asistencia
 */
exports.list = function(req, res) { 
	Asistencium.find().sort('-created').populate('user', 'displayName').exec(function(err, asistencia) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(asistencia);
		}
	});
};

/**
 * Asistencium middleware
 */
exports.asistenciumByID = function(req, res, next, id) { 
	Asistencium.findById(id).populate('user', 'displayName').exec(function(err, asistencium) {
		if (err) return next(err);
		if (! asistencium) return next(new Error('Failed to load Asistencium ' + id));
		req.asistencium = asistencium ;
		next();
	});
};

/**
 * Asistencium authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.asistencium.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
