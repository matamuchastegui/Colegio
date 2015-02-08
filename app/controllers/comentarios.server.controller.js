'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Comentario = mongoose.model('Comentario'),
	_ = require('lodash');

/**
 * Create a Comentario
 */
exports.create = function(req, res) {
	var comentario = new Comentario(req.body);
	comentario.user = req.user;

	comentario.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comentario);
		}
	});
};

/**
 * Show the current Comentario
 */
exports.read = function(req, res) {
	res.jsonp(req.comentario);
};

/**
 * Update a Comentario
 */
exports.update = function(req, res) {
	var comentario = req.comentario ;

	comentario = _.extend(comentario , req.body);

	comentario.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comentario);
		}
	});
};

/**
 * Delete an Comentario
 */
exports.delete = function(req, res) {
	var comentario = req.comentario ;

	comentario.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comentario);
		}
	});
};

/**
 * List of Comentarios
 */
exports.list = function(req, res) { 
	Comentario.find().sort('-created').populate('user', 'displayName').exec(function(err, comentarios) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comentarios);
		}
	});
};

/**
 * Comentario middleware
 */
exports.comentarioByID = function(req, res, next, id) { 
	Comentario.findById(id).populate('user', 'displayName').exec(function(err, comentario) {
		if (err) return next(err);
		if (! comentario) return next(new Error('Failed to load Comentario ' + id));
		req.comentario = comentario ;
		next();
	});
};

/**
 * Comentario authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comentario.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
