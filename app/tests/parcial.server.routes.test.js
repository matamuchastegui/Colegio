'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Parcial = mongoose.model('Parcial'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, parcial;

/**
 * Parcial routes tests
 */
describe('Parcial CRUD tests', function() {
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

		// Save a user to the test db and create new Parcial
		user.save(function() {
			parcial = {
				name: 'Parcial Name'
			};

			done();
		});
	});

	it('should be able to save Parcial instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parcial
				agent.post('/parcials')
					.send(parcial)
					.expect(200)
					.end(function(parcialSaveErr, parcialSaveRes) {
						// Handle Parcial save error
						if (parcialSaveErr) done(parcialSaveErr);

						// Get a list of Parcials
						agent.get('/parcials')
							.end(function(parcialsGetErr, parcialsGetRes) {
								// Handle Parcial save error
								if (parcialsGetErr) done(parcialsGetErr);

								// Get Parcials list
								var parcials = parcialsGetRes.body;

								// Set assertions
								(parcials[0].user._id).should.equal(userId);
								(parcials[0].name).should.match('Parcial Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Parcial instance if not logged in', function(done) {
		agent.post('/parcials')
			.send(parcial)
			.expect(401)
			.end(function(parcialSaveErr, parcialSaveRes) {
				// Call the assertion callback
				done(parcialSaveErr);
			});
	});

	it('should not be able to save Parcial instance if no name is provided', function(done) {
		// Invalidate name field
		parcial.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parcial
				agent.post('/parcials')
					.send(parcial)
					.expect(400)
					.end(function(parcialSaveErr, parcialSaveRes) {
						// Set message assertion
						(parcialSaveRes.body.message).should.match('Please fill Parcial name');
						
						// Handle Parcial save error
						done(parcialSaveErr);
					});
			});
	});

	it('should be able to update Parcial instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parcial
				agent.post('/parcials')
					.send(parcial)
					.expect(200)
					.end(function(parcialSaveErr, parcialSaveRes) {
						// Handle Parcial save error
						if (parcialSaveErr) done(parcialSaveErr);

						// Update Parcial name
						parcial.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Parcial
						agent.put('/parcials/' + parcialSaveRes.body._id)
							.send(parcial)
							.expect(200)
							.end(function(parcialUpdateErr, parcialUpdateRes) {
								// Handle Parcial update error
								if (parcialUpdateErr) done(parcialUpdateErr);

								// Set assertions
								(parcialUpdateRes.body._id).should.equal(parcialSaveRes.body._id);
								(parcialUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Parcials if not signed in', function(done) {
		// Create new Parcial model instance
		var parcialObj = new Parcial(parcial);

		// Save the Parcial
		parcialObj.save(function() {
			// Request Parcials
			request(app).get('/parcials')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Parcial if not signed in', function(done) {
		// Create new Parcial model instance
		var parcialObj = new Parcial(parcial);

		// Save the Parcial
		parcialObj.save(function() {
			request(app).get('/parcials/' + parcialObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', parcial.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Parcial instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Parcial
				agent.post('/parcials')
					.send(parcial)
					.expect(200)
					.end(function(parcialSaveErr, parcialSaveRes) {
						// Handle Parcial save error
						if (parcialSaveErr) done(parcialSaveErr);

						// Delete existing Parcial
						agent.delete('/parcials/' + parcialSaveRes.body._id)
							.send(parcial)
							.expect(200)
							.end(function(parcialDeleteErr, parcialDeleteRes) {
								// Handle Parcial error error
								if (parcialDeleteErr) done(parcialDeleteErr);

								// Set assertions
								(parcialDeleteRes.body._id).should.equal(parcialSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Parcial instance if not signed in', function(done) {
		// Set Parcial user 
		parcial.user = user;

		// Create new Parcial model instance
		var parcialObj = new Parcial(parcial);

		// Save the Parcial
		parcialObj.save(function() {
			// Try deleting Parcial
			request(app).delete('/parcials/' + parcialObj._id)
			.expect(401)
			.end(function(parcialDeleteErr, parcialDeleteRes) {
				// Set message assertion
				(parcialDeleteRes.body.message).should.match('User is not logged in');

				// Handle Parcial error error
				done(parcialDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Parcial.remove().exec();
		done();
	});
});