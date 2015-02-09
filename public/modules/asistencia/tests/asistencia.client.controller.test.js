'use strict';

(function() {
	// Asistencia Controller Spec
	describe('Asistencia Controller Tests', function() {
		// Initialize global variables
		var AsistenciaController,
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

			// Initialize the Asistencia controller.
			AsistenciaController = $controller('AsistenciaController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Asistencium object fetched from XHR', inject(function(Asistencia) {
			// Create sample Asistencium using the Asistencia service
			var sampleAsistencium = new Asistencia({
				name: 'New Asistencium'
			});

			// Create a sample Asistencia array that includes the new Asistencium
			var sampleAsistencia = [sampleAsistencium];

			// Set GET response
			$httpBackend.expectGET('asistencia').respond(sampleAsistencia);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.asistencia).toEqualData(sampleAsistencia);
		}));

		it('$scope.findOne() should create an array with one Asistencium object fetched from XHR using a asistenciumId URL parameter', inject(function(Asistencia) {
			// Define a sample Asistencium object
			var sampleAsistencium = new Asistencia({
				name: 'New Asistencium'
			});

			// Set the URL parameter
			$stateParams.asistenciumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/asistencia\/([0-9a-fA-F]{24})$/).respond(sampleAsistencium);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.asistencium).toEqualData(sampleAsistencium);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Asistencia) {
			// Create a sample Asistencium object
			var sampleAsistenciumPostData = new Asistencia({
				name: 'New Asistencium'
			});

			// Create a sample Asistencium response
			var sampleAsistenciumResponse = new Asistencia({
				_id: '525cf20451979dea2c000001',
				name: 'New Asistencium'
			});

			// Fixture mock form input values
			scope.name = 'New Asistencium';

			// Set POST response
			$httpBackend.expectPOST('asistencia', sampleAsistenciumPostData).respond(sampleAsistenciumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Asistencium was created
			expect($location.path()).toBe('/asistencia/' + sampleAsistenciumResponse._id);
		}));

		it('$scope.update() should update a valid Asistencium', inject(function(Asistencia) {
			// Define a sample Asistencium put data
			var sampleAsistenciumPutData = new Asistencia({
				_id: '525cf20451979dea2c000001',
				name: 'New Asistencium'
			});

			// Mock Asistencium in scope
			scope.asistencium = sampleAsistenciumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/asistencia\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/asistencia/' + sampleAsistenciumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid asistenciumId and remove the Asistencium from the scope', inject(function(Asistencia) {
			// Create new Asistencium object
			var sampleAsistencium = new Asistencia({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Asistencia array and include the Asistencium
			scope.asistencia = [sampleAsistencium];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/asistencia\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAsistencium);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.asistencia.length).toBe(0);
		}));
	});
}());