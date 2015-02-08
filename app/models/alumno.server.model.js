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
	name: {
		type: String,
		default: '',
		required: 'Please fill Alumno name',
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

mongoose.model('Alumno', AlumnoSchema);