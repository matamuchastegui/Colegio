'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Alumno Schema
 */
var AlumnoSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Please fill Alumno nombre',
		trim: true
	},
	apellido: {
		type: String,
		default: '',
		required: 'Please fill Alumno apellido',
		trim: true
	},
	dni: {
		type: String,
		default: '',
		required: 'Please fill Alumno dni',
		trim: true
	},
	direccion: {
		calle: {
			type: String,
			default: '',
			required: 'Please fill Alumno calle',
			trim: true
		},
		numero: {
			type: String,
			default: '',
			required: 'Please fill Alumno numero',
			trim: true
		},
		dpto: {
			type: String,
			default: '',
			required: 'Please fill Alumno dpto',
			trim: true
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

mongoose.model('Alumno', AlumnoSchema);