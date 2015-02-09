'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Asistencium Schema
 */
var AsistenciumSchema = new Schema({
	fecha: {
		type: Date,
		default: Date.now,
		trim: true
	},
	presentes:{
		type: Array,
		present: {
			type: Schema.ObjectId, 
			ref: 'Alumno',
			//default: [{nombre: 'asd', apellido: 'app', dni: '123'}]
		}
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Asistencium', AsistenciumSchema);