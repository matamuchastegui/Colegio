'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Comentario = mongoose.model('Comentario'),
	//ObjectId = require('mongoose').ObjectId,
	//Alumno = mongoose.model('Alumno'),
	_ = require('lodash');

/**
 * Create a Comentario
 */
exports.create = function(req, res) {
	var comentario = new Comentario(req.body);
	comentario.user = req.user;
	//alumno.user = req.alumno;
	console.info(req);

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
	//console.info(res.jsonp(req.comentario));
	console.info( req.comentario.alumno ); // Devuelve el ObjectId del alumno
	//res.jsonp(req.alumno); // Esto es indefinido
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
/*exports.list = function(req, res) { 

	var count = req.query.count || 5; // Si no hay registros devuelve 5
	var page = req.query.page || 1;
	
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
	//alert('asd');
	var filter = {
			filters: {
				mandatory: {
					//exact: {
						contains: req.query.filter
					//}
				}
			}
		};
	Comentario
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination,function(err, alumnos){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(alumnos);
			}
		}); 
	
};*/

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

exports.list = function(req, res) { 
	
	var count = req.query.count || 5; // Si no hay registros devuelve 5
	var page = req.query.page || 1;
	
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
	//alert('asd');

	//var oid = new ObjectId('54d83e9a063067541f27c39f');
	//db.things.find(_id: );
	//console.info(req.comentario.alumno); 
	var filter = {
			filters: {
				mandatory: {
						contains: {
								//_id: {$gt: oid}
								//_id: new ObjectId('54d83e9a063067541f27c39f')
								
								//name: 'prueba'  //Funciona
								//alumno: '54d780fb6da273c81c6072b6'
								//alumno: { name: 'Matias'}
								//alumno.nombre: 'Matias'
								//req.query.filter
							}
				}
			}
		};


	Comentario
	.find()
	//.sort('-created')
	.field({ filters : { field : [ 'name', '_id', 'alumno' ] } } ) // Campos que muestra, como decir SELECT name, _id 
	.order(sort)
	.filter(filter)
	.populate('alumno', null, { _id: { $in: [ '54d780fb6da273c81c6072b6' ] } } )
	//.populate('alumno')
	.exec(function(err, comentarios) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comentarios);
        }
    });
};
exports.list3 = function(req, res) { 
	console.info(req.alumno); // Me devuelve el alumno con la ID que mando por parametros al navegadors
	res.jsonp(req.comentario);
};

exports.list2 = function(req, res) { 
	
	res.jsonp(req.comentario);

	var count = req.query.count || 5; // Si no hay registros devuelve 5
	var page = req.query.page || 1;
	
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
	//console.info(req.comentario.alumno);
	var filter = {
			filters: {
				mandatory: {
						contains: {
								//_id: {$gt: oid}
								//_id: new ObjectId('54d83e9a063067541f27c39f')
								
								//name: 'prueba'  //Funciona
								//alumno: '54d780fb6da273c81c6072b6'
								//alumno: { name: 'Matias'}
								//alumno.nombre: 'Matias'
								//req.query.filter
							}
				}
			}
		};


	Comentario
	.find()
	.field({ filters : { field : [ 'name', '_id', 'alumno' ] } } ) // Campos que muestra, como decir SELECT name, _id 
	.order(sort)
	.filter(filter)
	.populate('alumno')
	.exec(function(err, comentarios) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comentarios);
        }
    });
};

 
/*exports.comentarioById = function(req, res, next, id) { Comentario.findById(id).populate('alumno').exec(function(err, comentario) {
        if (err) return next(err);
        if (! comentario) return next(new Error('Failed to load Comentario ' + id));
        req.comentario = comentario ;
        next();
    });
};*/


/**
 * Comentario authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comentario.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
