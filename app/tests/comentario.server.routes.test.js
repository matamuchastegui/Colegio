'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Comentario = mongoose.model('Comentario'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, comentario;

/**
 * Comentario routes tests
 */
describe('Comentario CRUD tests', function() {
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

		// Save a user to the test db and create new Comentario
		user.save(function() {
			comentario = {
				name: 'Comentario Name'
			};

			done();
		});
	});

	it('should be able to save Comentario instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Comentario
				agent.post('/comentarios')
					.send(comentario)
					.expect(200)
					.end(function(comentarioSaveErr, comentarioSaveRes) {
						// Handle Comentario save error
						if (comentarioSaveErr) done(comentarioSaveErr);

						// Get a list of Comentarios
						agent.get('/comentarios')
							.end(function(comentariosGetErr, comentariosGetRes) {
								// Handle Comentario save error
								if (comentariosGetErr) done(comentariosGetErr);

								// Get Comentarios list
								var comentarios = comentariosGetRes.body;

								// Set assertions
								(comentarios[0].user._id).should.equal(userId);
								(comentarios[0].name).should.match('Comentario Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Comentario instance if not logged in', function(done) {
		agent.post('/comentarios')
			.send(comentario)
			.expect(401)
			.end(function(comentarioSaveErr, comentarioSaveRes) {
				// Call the assertion callback
				done(comentarioSaveErr);
			});
	});

	it('should not be able to save Comentario instance if no name is provided', function(done) {
		// Invalidate name field
		comentario.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Comentario
				agent.post('/comentarios')
					.send(comentario)
					.expect(400)
					.end(function(comentarioSaveErr, comentarioSaveRes) {
						// Set message assertion
						(comentarioSaveRes.body.message).should.match('Please fill Comentario name');
						
						// Handle Comentario save error
						done(comentarioSaveErr);
					});
			});
	});

	it('should be able to update Comentario instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Comentario
				agent.post('/comentarios')
					.send(comentario)
					.expect(200)
					.end(function(comentarioSaveErr, comentarioSaveRes) {
						// Handle Comentario save error
						if (comentarioSaveErr) done(comentarioSaveErr);

						// Update Comentario name
						comentario.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Comentario
						agent.put('/comentarios/' + comentarioSaveRes.body._id)
							.send(comentario)
							.expect(200)
							.end(function(comentarioUpdateErr, comentarioUpdateRes) {
								// Handle Comentario update error
								if (comentarioUpdateErr) done(comentarioUpdateErr);

								// Set assertions
								(comentarioUpdateRes.body._id).should.equal(comentarioSaveRes.body._id);
								(comentarioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Comentarios if not signed in', function(done) {
		// Create new Comentario model instance
		var comentarioObj = new Comentario(comentario);

		// Save the Comentario
		comentarioObj.save(function() {
			// Request Comentarios
			request(app).get('/comentarios')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Comentario if not signed in', function(done) {
		// Create new Comentario model instance
		var comentarioObj = new Comentario(comentario);

		// Save the Comentario
		comentarioObj.save(function() {
			request(app).get('/comentarios/' + comentarioObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', comentario.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Comentario instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Comentario
				agent.post('/comentarios')
					.send(comentario)
					.expect(200)
					.end(function(comentarioSaveErr, comentarioSaveRes) {
						// Handle Comentario save error
						if (comentarioSaveErr) done(comentarioSaveErr);

						// Delete existing Comentario
						agent.delete('/comentarios/' + comentarioSaveRes.body._id)
							.send(comentario)
							.expect(200)
							.end(function(comentarioDeleteErr, comentarioDeleteRes) {
								// Handle Comentario error error
								if (comentarioDeleteErr) done(comentarioDeleteErr);

								// Set assertions
								(comentarioDeleteRes.body._id).should.equal(comentarioSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Comentario instance if not signed in', function(done) {
		// Set Comentario user 
		comentario.user = user;

		// Create new Comentario model instance
		var comentarioObj = new Comentario(comentario);

		// Save the Comentario
		comentarioObj.save(function() {
			// Try deleting Comentario
			request(app).delete('/comentarios/' + comentarioObj._id)
			.expect(401)
			.end(function(comentarioDeleteErr, comentarioDeleteRes) {
				// Set message assertion
				(comentarioDeleteRes.body.message).should.match('User is not logged in');

				// Handle Comentario error error
				done(comentarioDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Comentario.remove().exec();
		done();
	});
});