'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Materium Schema
 */
var MateriumSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Materium name',
		trim: true
	},
	temas: {
		type: Array
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

mongoose.model('Materium', MateriumSchema);