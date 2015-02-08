'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Materium = mongoose.model('Materium'),
	_ = require('lodash');

/**
 * Create a Materium
 */
exports.create = function(req, res) {
	var materium = new Materium(req.body);
	materium.user = req.user;

	materium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(materium);
		}
	});
};

/**
 * Show the current Materium
 */
exports.read = function(req, res) {
	res.jsonp(req.materium);
};

/**
 * Update a Materium
 */
exports.update = function(req, res) {
	var materium = req.materium ;

	materium = _.extend(materium , req.body);

	materium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(materium);
		}
	});
};

/**
 * Delete an Materium
 */
exports.delete = function(req, res) {
	var materium = req.materium ;

	materium.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(materium);
		}
	});
};

/**
 * List of Materia
 */
exports.list = function(req, res) { 
	Materium.find().sort('-created').populate('user', 'displayName').exec(function(err, materia) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(materia);
		}
	});
};

/**
 * Materium middleware
 */
exports.materiumByID = function(req, res, next, id) { 
	Materium.findById(id).populate('user', 'displayName').exec(function(err, materium) {
		if (err) return next(err);
		if (! materium) return next(new Error('Failed to load Materium ' + id));
		req.materium = materium ;
		next();
	});
};

/**
 * Materium authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.materium.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
