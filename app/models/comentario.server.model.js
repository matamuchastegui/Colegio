'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comentario Schema
 */
var ComentarioSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Comentario name',
		trim: true
	},
	asunto: {
		type: String,
		default: '',
		required: 'Please fill Comentario asunto',
		trim: true
	},
	alumno: {
		type: Schema.ObjectId,
		required: 'Error: no hay alumno',
		ref: 'Alumno'
	},
	contenido: {
		type: String,
		default: '',
		trim: true
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

mongoose.model('Comentario', ComentarioSchema);