'use strict';

// Comentarios controller
angular.module('comentarios').controller('ComentariosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Comentarios',
	function($scope, $stateParams, $location, Authentication, Comentarios) {
		$scope.authentication = Authentication;

		// Create new Comentario
		$scope.create = function() {
			// Create new Comentario object
			var comentario = new Comentarios ({
				name: this.name
			});

			// Redirect after save
			comentario.$save(function(response) {
				$location.path('comentarios/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Comentario
		$scope.remove = function(comentario) {
			if ( comentario ) { 
				comentario.$remove();

				for (var i in $scope.comentarios) {
					if ($scope.comentarios [i] === comentario) {
						$scope.comentarios.splice(i, 1);
					}
				}
			} else {
				$scope.comentario.$remove(function() {
					$location.path('comentarios');
				});
			}
		};

		// Update existing Comentario
		$scope.update = function() {
			var comentario = $scope.comentario;

			comentario.$update(function() {
				$location.path('comentarios/' + comentario._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Comentarios
		$scope.find = function() {
			$scope.comentarios = Comentarios.query();
		};

		// Find existing Comentario
		$scope.findOne = function() {
			$scope.comentario = Comentarios.get({ 
				comentarioId: $stateParams.comentarioId
			});
		};
	}
]);