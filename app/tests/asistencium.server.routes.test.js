'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Asistencium = mongoose.model('Asistencium'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, asistencium;

/**
 * Asistencium routes tests
 */
describe('Asistencium CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Asistencium
		user.save(function() {
			asistencium = {
				name: 'Asistencium Name'
			};

			done();
		});
	});

	it('should be able to save Asistencium instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Asistencium
				agent.post('/asistencia')
					.send(asistencium)
					.expect(200)
					.end(function(asistenciumSaveErr, asistenciumSaveRes) {
						// Handle Asistencium save error
						if (asistenciumSaveErr) done(asistenciumSaveErr);

						// Get a list of Asistencia
						agent.get('/asistencia')
							.end(function(asistenciaGetErr, asistenciaGetRes) {
								// Handle Asistencium save error
								if (asistenciaGetErr) done(asistenciaGetErr);

								// Get Asistencia list
								var asistencia = asistenciaGetRes.body;

								// Set assertions
								(asistencia[0].user._id).should.equal(userId);
								(asistencia[0].name).should.match('Asistencium Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Asistencium instance if not logged in', function(done) {
		agent.post('/asistencia')
			.send(asistencium)
			.expect(401)
			.end(function(asistenciumSaveErr, asistenciumSaveRes) {
				// Call the assertion callback
				done(asistenciumSaveErr);
			});
	});

	it('should not be able to save Asistencium instance if no name is provided', function(done) {
		// Invalidate name field
		asistencium.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Asistencium
				agent.post('/asistencia')
					.send(asistencium)
					.expect(400)
					.end(function(asistenciumSaveErr, asistenciumSaveRes) {
						// Set message assertion
						(asistenciumSaveRes.body.message).should.match('Please fill Asistencium name');
						
						// Handle Asistencium save error
						done(asistenciumSaveErr);
					});
			});
	});

	it('should be able to update Asistencium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Asistencium
				agent.post('/asistencia')
					.send(asistencium)
					.expect(200)
					.end(function(asistenciumSaveErr, asistenciumSaveRes) {
						// Handle Asistencium save error
						if (asistenciumSaveErr) done(asistenciumSaveErr);

						// Update Asistencium name
						asistencium.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Asistencium
						agent.put('/asistencia/' + asistenciumSaveRes.body._id)
							.send(asistencium)
							.expect(200)
							.end(function(asistenciumUpdateErr, asistenciumUpdateRes) {
								// Handle Asistencium update error
								if (asistenciumUpdateErr) done(asistenciumUpdateErr);

								// Set assertions
								(asistenciumUpdateRes.body._id).should.equal(asistenciumSaveRes.body._id);
								(asistenciumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Asistencia if not signed in', function(done) {
		// Create new Asistencium model instance
		var asistenciumObj = new Asistencium(asistencium);

		// Save the Asistencium
		asistenciumObj.save(function() {
			// Request Asistencia
			request(app).get('/asistencia')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Asistencium if not signed in', function(done) {
		// Create new Asistencium model instance
		var asistenciumObj = new Asistencium(asistencium);

		// Save the Asistencium
		asistenciumObj.save(function() {
			request(app).get('/asistencia/' + asistenciumObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', asistencium.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Asistencium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Asistencium
				agent.post('/asistencia')
					.send(asistencium)
					.expect(200)
					.end(function(asistenciumSaveErr, asistenciumSaveRes) {
						// Handle Asistencium save error
						if (asistenciumSaveErr) done(asistenciumSaveErr);

						// Delete existing Asistencium
						agent.delete('/asistencia/' + asistenciumSaveRes.body._id)
							.send(asistencium)
							.expect(200)
							.end(function(asistenciumDeleteErr, asistenciumDeleteRes) {
								// Handle Asistencium error error
								if (asistenciumDeleteErr) done(asistenciumDeleteErr);

								// Set assertions
								(asistenciumDeleteRes.body._id).should.equal(asistenciumSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Asistencium instance if not signed in', function(done) {
		// Set Asistencium user 
		asistencium.user = user;

		// Create new Asistencium model instance
		var asistenciumObj = new Asistencium(asistencium);

		// Save the Asistencium
		asistenciumObj.save(function() {
			// Try deleting Asistencium
			request(app).delete('/asistencia/' + asistenciumObj._id)
			.expect(401)
			.end(function(asistenciumDeleteErr, asistenciumDeleteRes) {
				// Set message assertion
				(asistenciumDeleteRes.body.message).should.match('User is not logged in');

				// Handle Asistencium error error
				done(asistenciumDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Asistencium.remove().exec();
		done();
	});
});