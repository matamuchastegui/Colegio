'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Alumno = mongoose.model('Alumno'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, alumno;

/**
 * Alumno routes tests
 */
describe('Alumno CRUD tests', function() {
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

		// Save a user to the test db and create new Alumno
		user.save(function() {
			alumno = {
				name: 'Alumno Name'
			};

			done();
		});
	});

	it('should be able to save Alumno instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Alumno
				agent.post('/alumnos')
					.send(alumno)
					.expect(200)
					.end(function(alumnoSaveErr, alumnoSaveRes) {
						// Handle Alumno save error
						if (alumnoSaveErr) done(alumnoSaveErr);

						// Get a list of Alumnos
						agent.get('/alumnos')
							.end(function(alumnosGetErr, alumnosGetRes) {
								// Handle Alumno save error
								if (alumnosGetErr) done(alumnosGetErr);

								// Get Alumnos list
								var alumnos = alumnosGetRes.body;

								// Set assertions
								(alumnos[0].user._id).should.equal(userId);
								(alumnos[0].name).should.match('Alumno Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Alumno instance if not logged in', function(done) {
		agent.post('/alumnos')
			.send(alumno)
			.expect(401)
			.end(function(alumnoSaveErr, alumnoSaveRes) {
				// Call the assertion callback
				done(alumnoSaveErr);
			});
	});

	it('should not be able to save Alumno instance if no name is provided', function(done) {
		// Invalidate name field
		alumno.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Alumno
				agent.post('/alumnos')
					.send(alumno)
					.expect(400)
					.end(function(alumnoSaveErr, alumnoSaveRes) {
						// Set message assertion
						(alumnoSaveRes.body.message).should.match('Please fill Alumno name');
						
						// Handle Alumno save error
						done(alumnoSaveErr);
					});
			});
	});

	it('should be able to update Alumno instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Alumno
				agent.post('/alumnos')
					.send(alumno)
					.expect(200)
					.end(function(alumnoSaveErr, alumnoSaveRes) {
						// Handle Alumno save error
						if (alumnoSaveErr) done(alumnoSaveErr);

						// Update Alumno name
						alumno.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Alumno
						agent.put('/alumnos/' + alumnoSaveRes.body._id)
							.send(alumno)
							.expect(200)
							.end(function(alumnoUpdateErr, alumnoUpdateRes) {
								// Handle Alumno update error
								if (alumnoUpdateErr) done(alumnoUpdateErr);

								// Set assertions
								(alumnoUpdateRes.body._id).should.equal(alumnoSaveRes.body._id);
								(alumnoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Alumnos if not signed in', function(done) {
		// Create new Alumno model instance
		var alumnoObj = new Alumno(alumno);

		// Save the Alumno
		alumnoObj.save(function() {
			// Request Alumnos
			request(app).get('/alumnos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Alumno if not signed in', function(done) {
		// Create new Alumno model instance
		var alumnoObj = new Alumno(alumno);

		// Save the Alumno
		alumnoObj.save(function() {
			request(app).get('/alumnos/' + alumnoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', alumno.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Alumno instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Alumno
				agent.post('/alumnos')
					.send(alumno)
					.expect(200)
					.end(function(alumnoSaveErr, alumnoSaveRes) {
						// Handle Alumno save error
						if (alumnoSaveErr) done(alumnoSaveErr);

						// Delete existing Alumno
						agent.delete('/alumnos/' + alumnoSaveRes.body._id)
							.send(alumno)
							.expect(200)
							.end(function(alumnoDeleteErr, alumnoDeleteRes) {
								// Handle Alumno error error
								if (alumnoDeleteErr) done(alumnoDeleteErr);

								// Set assertions
								(alumnoDeleteRes.body._id).should.equal(alumnoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Alumno instance if not signed in', function(done) {
		// Set Alumno user 
		alumno.user = user;

		// Create new Alumno model instance
		var alumnoObj = new Alumno(alumno);

		// Save the Alumno
		alumnoObj.save(function() {
			// Try deleting Alumno
			request(app).delete('/alumnos/' + alumnoObj._id)
			.expect(401)
			.end(function(alumnoDeleteErr, alumnoDeleteRes) {
				// Set message assertion
				(alumnoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Alumno error error
				done(alumnoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Alumno.remove().exec();
		done();
	});
});