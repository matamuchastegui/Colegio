'use strict';

(function() {
	// Alumnos Controller Spec
	describe('Alumnos Controller Tests', function() {
		// Initialize global variables
		var AlumnosController,
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

			// Initialize the Alumnos controller.
			AlumnosController = $controller('AlumnosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Alumno object fetched from XHR', inject(function(Alumnos) {
			// Create sample Alumno using the Alumnos service
			var sampleAlumno = new Alumnos({
				name: 'New Alumno'
			});

			// Create a sample Alumnos array that includes the new Alumno
			var sampleAlumnos = [sampleAlumno];

			// Set GET response
			$httpBackend.expectGET('alumnos').respond(sampleAlumnos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.alumnos).toEqualData(sampleAlumnos);
		}));

		it('$scope.findOne() should create an array with one Alumno object fetched from XHR using a alumnoId URL parameter', inject(function(Alumnos) {
			// Define a sample Alumno object
			var sampleAlumno = new Alumnos({
				name: 'New Alumno'
			});

			// Set the URL parameter
			$stateParams.alumnoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/alumnos\/([0-9a-fA-F]{24})$/).respond(sampleAlumno);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.alumno).toEqualData(sampleAlumno);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Alumnos) {
			// Create a sample Alumno object
			var sampleAlumnoPostData = new Alumnos({
				name: 'New Alumno'
			});

			// Create a sample Alumno response
			var sampleAlumnoResponse = new Alumnos({
				_id: '525cf20451979dea2c000001',
				name: 'New Alumno'
			});

			// Fixture mock form input values
			scope.name = 'New Alumno';

			// Set POST response
			$httpBackend.expectPOST('alumnos', sampleAlumnoPostData).respond(sampleAlumnoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Alumno was created
			expect($location.path()).toBe('/alumnos/' + sampleAlumnoResponse._id);
		}));

		it('$scope.update() should update a valid Alumno', inject(function(Alumnos) {
			// Define a sample Alumno put data
			var sampleAlumnoPutData = new Alumnos({
				_id: '525cf20451979dea2c000001',
				name: 'New Alumno'
			});

			// Mock Alumno in scope
			scope.alumno = sampleAlumnoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/alumnos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/alumnos/' + sampleAlumnoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid alumnoId and remove the Alumno from the scope', inject(function(Alumnos) {
			// Create new Alumno object
			var sampleAlumno = new Alumnos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Alumnos array and include the Alumno
			scope.alumnos = [sampleAlumno];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/alumnos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAlumno);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.alumnos.length).toBe(0);
		}));
	});
}());