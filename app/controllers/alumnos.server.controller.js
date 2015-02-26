'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Alumno = mongoose.model('Alumno'),
	_ = require('lodash');

/**
 * Create a Alumno
 */
exports.create = function(req, res) {
	var alumno = new Alumno(req.body);
	alumno.user = req.user;

	alumno.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(alumno);
		}
	});
};

/**
 * Show the current Alumno
 */
exports.read = function(req, res) {
	//console.info(req.alumno);
	//console.info( JSON.parse(JSON.stringify(req.alumnos)) );
	res.jsonp(req.alumno);
};

/**
 * Update a Alumno
 */
exports.update = function(req, res) {
	var alumno = req.alumno ;

	alumno = _.extend(alumno , req.body);

	alumno.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(alumno);
		}
	});
};

/**
 * Delete an Alumno
 */
exports.delete = function(req, res) {
	var alumno = req.alumno ;

	alumno.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(alumno);
		}
	});
};

/**
 * List of Alumnos
 */

exports.list = function(req, res) { 

	var count = req.query.count || 5; // Si no hay registros devuelve 5
	var page = req.query.page || 1;
	var filter = {
		filters: {
            mandatory : {
                contains : req.query.filter 
            }
		}
	};
	console.info(req.query);
	var pagination = {
		start: (page - 1) * count, // La primer pagina es la 0
		count: count
	};
	
	var sortObject = {};
	if(req.query.sorting)
	{
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}
	else{
		sortObject.desc = '_id';
		//sortObject['desc'].push('_id');
	}
	var sort = {
		sort: sortObject
	};	

	Alumno
		.find()
		//.field({ filters : { field : [ 'nombre', 'dni', '_id', 'comentario' ] } } )
		.filter(filter)
		.order(sort)
		.populate('comentario')
		//.page(pagination)
		.exec(function(err, comentarios) {
	        if (err) {
	            return res.status(400).send({
	                message: errorHandler.getErrorMessage(err)
	            });
	        } else {
	            res.jsonp(comentarios);
	        }
	   	 });
		/*.page(pagination, function(err, alumnos){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(alumnos);
			}
		});*/
	
};


/**
 * Alumno middleware
 */
exports.alumnoByID = function(req, res, next, id) { 
	Alumno.findById(id).populate('user', 'displayName').exec(function(err, alumno) {
		if (err) return next(err);
		if (! alumno) return next(new Error('Failed to load Alumno ' + id));
		req.alumno = alumno ;
		next();
	});
};

/**
 * Alumno authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.alumno.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
