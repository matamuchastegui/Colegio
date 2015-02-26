'use strict';

// Comentarios controller
angular.module('comentarios').controller('ComentariosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Comentarios', 'Alumnos', 'NgTableParams',
	function($scope, $stateParams, $location, Authentication, Comentarios, Alumnos, NgTableParams) {
		$scope.authentication = Authentication;

		/*var params = {
			page: 1,            // show first page
        	count: 5
		};

		var settings = {
			total: 0,  
			counts: [5, 10, 20],         // length of data
	        getData: function($defer, params) {
	            // ajax request to api
	            Comentarios.get(params.url(), function(response) {
	                    // update table params
	                    params.total(response.total);
	                    // set new data
	                    $defer.resolve(response.results);
	            	});
	    	}
    	};
		$scope.tableParams = new NgTableParams(params, settings);*/



		// Create new Comentario
		$scope.create = function() {
			// Create new Comentario object
			var comentario = new Comentarios ({
				name: this.name,
				asunto: this.asunto,
				contenido: this.contenido,
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