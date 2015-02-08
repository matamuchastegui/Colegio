'use strict';

// Alumnos controller
angular.module('alumnos').controller('AlumnosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Alumnos',
	function($scope, $stateParams, $location, Authentication, Alumnos) {
		$scope.authentication = Authentication;

		// Create new Alumno
		$scope.create = function() {
			// Create new Alumno object
			var alumno = new Alumnos ({
				nombre: this.nombre,
				apellido: this.apellido,
				dni: this.dni,
				direccion.calle: this.direccion.calle,
				direccion.numero: this.direccion.numero,
				direccion.dpto: this.direccion.dpto
				
			});

			// Redirect after save
			alumno.$save(function(response) {
				$location.path('alumnos/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.nombre = '';
				$scope.apellido = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Alumno
		$scope.remove = function(alumno) {
			if ( alumno ) { 
				alumno.$remove();

				for (var i in $scope.alumnos) {
					if ($scope.alumnos [i] === alumno) {
						$scope.alumnos.splice(i, 1);
					}
				}
			} else {
				$scope.alumno.$remove(function() {
					$location.path('alumnos');
				});
			}
		};

		// Update existing Alumno
		$scope.update = function() {
			var alumno = $scope.alumno;

			alumno.$update(function() {
				$location.path('alumnos/' + alumno._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Alumnos
		$scope.find = function() {
			$scope.alumnos = Alumnos.query();
		};

		// Find existing Alumno
		$scope.findOne = function() {
			$scope.alumno = Alumnos.get({ 
				alumnoId: $stateParams.alumnoId
			});
		};
	}
]);