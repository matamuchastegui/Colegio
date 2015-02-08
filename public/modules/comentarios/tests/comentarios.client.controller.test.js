'use strict';

(function() {
	// Comentarios Controller Spec
	describe('Comentarios Controller Tests', function() {
		// Initialize global variables
		var ComentariosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Comentarios controller.
			ComentariosController = $controller('ComentariosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Comentario object fetched from XHR', inject(function(Comentarios) {
			// Create sample Comentario using the Comentarios service
			var sampleComentario = new Comentarios({
				name: 'New Comentario'
			});

			// Create a sample Comentarios array that includes the new Comentario
			var sampleComentarios = [sampleComentario];

			// Set GET response
			$httpBackend.expectGET('comentarios').respond(sampleComentarios);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.comentarios).toEqualData(sampleComentarios);
		}));

		it('$scope.findOne() should create an array with one Comentario object fetched from XHR using a comentarioId URL parameter', inject(function(Comentarios) {
			// Define a sample Comentario object
			var sampleComentario = new Comentarios({
				name: 'New Comentario'
			});

			// Set the URL parameter
			$stateParams.comentarioId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/comentarios\/([0-9a-fA-F]{24})$/).respond(sampleComentario);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.comentario).toEqualData(sampleComentario);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Comentarios) {
			// Create a sample Comentario object
			var sampleComentarioPostData = new Comentarios({
				name: 'New Comentario'
			});

			// Create a sample Comentario response
			var sampleComentarioResponse = new Comentarios({
				_id: '525cf20451979dea2c000001',
				name: 'New Comentario'
			});

			// Fixture mock form input values
			scope.name = 'New Comentario';

			// Set POST response
			$httpBackend.expectPOST('comentarios', sampleComentarioPostData).respond(sampleComentarioResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Comentario was created
			expect($location.path()).toBe('/comentarios/' + sampleComentarioResponse._id);
		}));

		it('$scope.update() should update a valid Comentario', inject(function(Comentarios) {
			// Define a sample Comentario put data
			var sampleComentarioPutData = new Comentarios({
				_id: '525cf20451979dea2c000001',
				name: 'New Comentario'
			});

			// Mock Comentario in scope
			scope.comentario = sampleComentarioPutData;

			// Set PUT response
			$httpBackend.expectPUT(/comentarios\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/comentarios/' + sampleComentarioPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid comentarioId and remove the Comentario from the scope', inject(function(Comentarios) {
			// Create new Comentario object
			var sampleComentario = new Comentarios({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Comentarios array and include the Comentario
			scope.comentarios = [sampleComentario];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/comentarios\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleComentario);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.comentarios.length).toBe(0);
		}));
	});
}());