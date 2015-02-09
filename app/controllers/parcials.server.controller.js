'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Parcial = mongoose.model('Parcial'),
	_ = require('lodash');

/**
 * Create a Parcial
 */
exports.create = function(req, res) {
	var parcial = new Parcial(req.body);
	parcial.user = req.user;

	parcial.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parcial);
		}
	});
};

/**
 * Show the current Parcial
 */
exports.read = function(req, res) {
	res.jsonp(req.parcial);
};

/**
 * Update a Parcial
 */
exports.update = function(req, res) {
	var parcial = req.parcial ;

	parcial = _.extend(parcial , req.body);

	parcial.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parcial);
		}
	});
};

/**
 * Delete an Parcial
 */
exports.delete = function(req, res) {
	var parcial = req.parcial ;

	parcial.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parcial);
		}
	});
};

/**
 * List of Parcials
 */
exports.list = function(req, res) { 
	Parcial.find().sort('-created').populate('user', 'displayName').exec(function(err, parcials) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(parcials);
		}
	});
};

/**
 * Parcial middleware
 */
exports.parcialByID = function(req, res, next, id) { 
	Parcial.findById(id).populate('user', 'displayName').exec(function(err, parcial) {
		if (err) return next(err);
		if (! parcial) return next(new Error('Failed to load Parcial ' + id));
		req.parcial = parcial ;
		next();
	});
};

/**
 * Parcial authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.parcial.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
