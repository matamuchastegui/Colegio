'use strict';

// Materia controller
angular.module('materia').controller('MateriaController', ['$scope', '$stateParams', '$location', 'Authentication', 'Materia',
	function($scope, $stateParams, $location, Authentication, Materia) {
		$scope.authentication = Authentication;

		// Create new Materium
		$scope.create = function() {
			// Create new Materium object
			var materium = new Materia ({
				name: this.name
			});

			// Redirect after save
			materium.$save(function(response) {
				$location.path('materia/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Materium
		$scope.remove = function(materium) {
			if ( materium ) { 
				materium.$remove();

				for (var i in $scope.materia) {
					if ($scope.materia [i] === materium) {
						$scope.materia.splice(i, 1);
					}
				}
			} else {
				$scope.materium.$remove(function() {
					$location.path('materia');
				});
			}
		};

		// Update existing Materium
		$scope.update = function() {
			var materium = $scope.materium;

			materium.$update(function() {
				$location.path('materia/' + materium._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Materia
		$scope.find = function() {
			$scope.materia = Materia.query();
		};

		// Find existing Materium
		$scope.findOne = function() {
			$scope.materium = Materia.get({ 
				materiumId: $stateParams.materiumId
			});
		};
	}
]);