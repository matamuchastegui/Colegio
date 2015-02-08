'use strict';

(function() {
	// Materia Controller Spec
	describe('Materia Controller Tests', function() {
		// Initialize global variables
		var MateriaController,
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

			// Initialize the Materia controller.
			MateriaController = $controller('MateriaController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Materium object fetched from XHR', inject(function(Materia) {
			// Create sample Materium using the Materia service
			var sampleMaterium = new Materia({
				name: 'New Materium'
			});

			// Create a sample Materia array that includes the new Materium
			var sampleMateria = [sampleMaterium];

			// Set GET response
			$httpBackend.expectGET('materia').respond(sampleMateria);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.materia).toEqualData(sampleMateria);
		}));

		it('$scope.findOne() should create an array with one Materium object fetched from XHR using a materiumId URL parameter', inject(function(Materia) {
			// Define a sample Materium object
			var sampleMaterium = new Materia({
				name: 'New Materium'
			});

			// Set the URL parameter
			$stateParams.materiumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/materia\/([0-9a-fA-F]{24})$/).respond(sampleMaterium);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.materium).toEqualData(sampleMaterium);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Materia) {
			// Create a sample Materium object
			var sampleMateriumPostData = new Materia({
				name: 'New Materium'
			});

			// Create a sample Materium response
			var sampleMateriumResponse = new Materia({
				_id: '525cf20451979dea2c000001',
				name: 'New Materium'
			});

			// Fixture mock form input values
			scope.name = 'New Materium';

			// Set POST response
			$httpBackend.expectPOST('materia', sampleMateriumPostData).respond(sampleMateriumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Materium was created
			expect($location.path()).toBe('/materia/' + sampleMateriumResponse._id);
		}));

		it('$scope.update() should update a valid Materium', inject(function(Materia) {
			// Define a sample Materium put data
			var sampleMateriumPutData = new Materia({
				_id: '525cf20451979dea2c000001',
				name: 'New Materium'
			});

			// Mock Materium in scope
			scope.materium = sampleMateriumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/materia\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/materia/' + sampleMateriumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid materiumId and remove the Materium from the scope', inject(function(Materia) {
			// Create new Materium object
			var sampleMaterium = new Materia({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Materia array and include the Materium
			scope.materia = [sampleMaterium];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/materia\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMaterium);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.materia.length).toBe(0);
		}));
	});
}());