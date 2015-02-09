'use strict';

// Parcials controller
angular.module('parcials').controller('ParcialsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Parcials',
	function($scope, $stateParams, $location, Authentication, Parcials) {
		$scope.authentication = Authentication;

		// Create new Parcial
		$scope.create = function() {
			// Create new Parcial object
			var parcial = new Parcials ({
				name: this.name
			});

			// Redirect after save
			parcial.$save(function(response) {
				$location.path('parcials/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Parcial
		$scope.remove = function(parcial) {
			if ( parcial ) { 
				parcial.$remove();

				for (var i in $scope.parcials) {
					if ($scope.parcials [i] === parcial) {
						$scope.parcials.splice(i, 1);
					}
				}
			} else {
				$scope.parcial.$remove(function() {
					$location.path('parcials');
				});
			}
		};

		// Update existing Parcial
		$scope.update = function() {
			var parcial = $scope.parcial;

			parcial.$update(function() {
				$location.path('parcials/' + parcial._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Parcials
		$scope.find = function() {
			$scope.parcials = Parcials.query();
		};

		// Find existing Parcial
		$scope.findOne = function() {
			$scope.parcial = Parcials.get({ 
				parcialId: $stateParams.parcialId
			});
		};
	}
]);