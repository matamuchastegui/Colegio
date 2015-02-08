'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Materium = mongoose.model('Materium'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, materium;

/**
 * Materium routes tests
 */
describe('Materium CRUD tests', function() {
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

		// Save a user to the test db and create new Materium
		user.save(function() {
			materium = {
				name: 'Materium Name'
			};

			done();
		});
	});

	it('should be able to save Materium instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Materium
				agent.post('/materia')
					.send(materium)
					.expect(200)
					.end(function(materiumSaveErr, materiumSaveRes) {
						// Handle Materium save error
						if (materiumSaveErr) done(materiumSaveErr);

						// Get a list of Materia
						agent.get('/materia')
							.end(function(materiaGetErr, materiaGetRes) {
								// Handle Materium save error
								if (materiaGetErr) done(materiaGetErr);

								// Get Materia list
								var materia = materiaGetRes.body;

								// Set assertions
								(materia[0].user._id).should.equal(userId);
								(materia[0].name).should.match('Materium Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Materium instance if not logged in', function(done) {
		agent.post('/materia')
			.send(materium)
			.expect(401)
			.end(function(materiumSaveErr, materiumSaveRes) {
				// Call the assertion callback
				done(materiumSaveErr);
			});
	});

	it('should not be able to save Materium instance if no name is provided', function(done) {
		// Invalidate name field
		materium.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Materium
				agent.post('/materia')
					.send(materium)
					.expect(400)
					.end(function(materiumSaveErr, materiumSaveRes) {
						// Set message assertion
						(materiumSaveRes.body.message).should.match('Please fill Materium name');
						
						// Handle Materium save error
						done(materiumSaveErr);
					});
			});
	});

	it('should be able to update Materium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Materium
				agent.post('/materia')
					.send(materium)
					.expect(200)
					.end(function(materiumSaveErr, materiumSaveRes) {
						// Handle Materium save error
						if (materiumSaveErr) done(materiumSaveErr);

						// Update Materium name
						materium.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Materium
						agent.put('/materia/' + materiumSaveRes.body._id)
							.send(materium)
							.expect(200)
							.end(function(materiumUpdateErr, materiumUpdateRes) {
								// Handle Materium update error
								if (materiumUpdateErr) done(materiumUpdateErr);

								// Set assertions
								(materiumUpdateRes.body._id).should.equal(materiumSaveRes.body._id);
								(materiumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Materia if not signed in', function(done) {
		// Create new Materium model instance
		var materiumObj = new Materium(materium);

		// Save the Materium
		materiumObj.save(function() {
			// Request Materia
			request(app).get('/materia')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Materium if not signed in', function(done) {
		// Create new Materium model instance
		var materiumObj = new Materium(materium);

		// Save the Materium
		materiumObj.save(function() {
			request(app).get('/materia/' + materiumObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', materium.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Materium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Materium
				agent.post('/materia')
					.send(materium)
					.expect(200)
					.end(function(materiumSaveErr, materiumSaveRes) {
						// Handle Materium save error
						if (materiumSaveErr) done(materiumSaveErr);

						// Delete existing Materium
						agent.delete('/materia/' + materiumSaveRes.body._id)
							.send(materium)
							.expect(200)
							.end(function(materiumDeleteErr, materiumDeleteRes) {
								// Handle Materium error error
								if (materiumDeleteErr) done(materiumDeleteErr);

								// Set assertions
								(materiumDeleteRes.body._id).should.equal(materiumSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Materium instance if not signed in', function(done) {
		// Set Materium user 
		materium.user = user;

		// Create new Materium model instance
		var materiumObj = new Materium(materium);

		// Save the Materium
		materiumObj.save(function() {
			// Try deleting Materium
			request(app).delete('/materia/' + materiumObj._id)
			.expect(401)
			.end(function(materiumDeleteErr, materiumDeleteRes) {
				// Set message assertion
				(materiumDeleteRes.body.message).should.match('User is not logged in');

				// Handle Materium error error
				done(materiumDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Materium.remove().exec();
		done();
	});
});