'use strict';

(function() {
	// Parcials Controller Spec
	describe('Parcials Controller Tests', function() {
		// Initialize global variables
		var ParcialsController,
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

			// Initialize the Parcials controller.
			ParcialsController = $controller('ParcialsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Parcial object fetched from XHR', inject(function(Parcials) {
			// Create sample Parcial using the Parcials service
			var sampleParcial = new Parcials({
				name: 'New Parcial'
			});

			// Create a sample Parcials array that includes the new Parcial
			var sampleParcials = [sampleParcial];

			// Set GET response
			$httpBackend.expectGET('parcials').respond(sampleParcials);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parcials).toEqualData(sampleParcials);
		}));

		it('$scope.findOne() should create an array with one Parcial object fetched from XHR using a parcialId URL parameter', inject(function(Parcials) {
			// Define a sample Parcial object
			var sampleParcial = new Parcials({
				name: 'New Parcial'
			});

			// Set the URL parameter
			$stateParams.parcialId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/parcials\/([0-9a-fA-F]{24})$/).respond(sampleParcial);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.parcial).toEqualData(sampleParcial);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Parcials) {
			// Create a sample Parcial object
			var sampleParcialPostData = new Parcials({
				name: 'New Parcial'
			});

			// Create a sample Parcial response
			var sampleParcialResponse = new Parcials({
				_id: '525cf20451979dea2c000001',
				name: 'New Parcial'
			});

			// Fixture mock form input values
			scope.name = 'New Parcial';

			// Set POST response
			$httpBackend.expectPOST('parcials', sampleParcialPostData).respond(sampleParcialResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Parcial was created
			expect($location.path()).toBe('/parcials/' + sampleParcialResponse._id);
		}));

		it('$scope.update() should update a valid Parcial', inject(function(Parcials) {
			// Define a sample Parcial put data
			var sampleParcialPutData = new Parcials({
				_id: '525cf20451979dea2c000001',
				name: 'New Parcial'
			});

			// Mock Parcial in scope
			scope.parcial = sampleParcialPutData;

			// Set PUT response
			$httpBackend.expectPUT(/parcials\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/parcials/' + sampleParcialPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid parcialId and remove the Parcial from the scope', inject(function(Parcials) {
			// Create new Parcial object
			var sampleParcial = new Parcials({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Parcials array and include the Parcial
			scope.parcials = [sampleParcial];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/parcials\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleParcial);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.parcials.length).toBe(0);
		}));
	});
}());