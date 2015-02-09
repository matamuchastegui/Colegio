'use strict';

// Asistencia controller
angular.module('asistencia').controller('AsistenciaController', ['$scope', '$stateParams', '$location', 'Authentication', 'Asistencia',
	function($scope, $stateParams, $location, Authentication, Asistencia) {
		$scope.authentication = Authentication;

		// Create new Asistencium
		$scope.create = function() {
			// Create new Asistencium object
			var asistencium = new Asistencia ({
				name: this.name
			});

			// Redirect after save
			asistencium.$save(function(response) {
				$location.path('asistencia/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Asistencium
		$scope.remove = function(asistencium) {
			if ( asistencium ) { 
				asistencium.$remove();

				for (var i in $scope.asistencia) {
					if ($scope.asistencia [i] === asistencium) {
						$scope.asistencia.splice(i, 1);
					}
				}
			} else {
				$scope.asistencium.$remove(function() {
					$location.path('asistencia');
				});
			}
		};

		// Update existing Asistencium
		$scope.update = function() {
			var asistencium = $scope.asistencium;

			asistencium.$update(function() {
				$location.path('asistencia/' + asistencium._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Asistencia
		$scope.find = function() {
			$scope.asistencia = Asistencia.query();
		};

		// Find existing Asistencium
		$scope.findOne = function() {
			$scope.asistencium = Asistencia.get({ 
				asistenciumId: $stateParams.asistenciumId
			});
		};
	}
]);