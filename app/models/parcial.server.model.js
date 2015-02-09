'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Parcial Schema
 */
var ParcialSchema = new Schema({
	materia: {
		type: String,
		default: '',
		required: 'Please fill Parcial materia',
		trim: true
	},
	nota: {
		type: String,
		default: '',
		required: 'Please fill Parcial nota',
		trim: true
	},
	fecha: {
		type: String,
		default: '',
		required: 'Please fill Parcial fecha',
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

mongoose.model('Parcial', ParcialSchema);