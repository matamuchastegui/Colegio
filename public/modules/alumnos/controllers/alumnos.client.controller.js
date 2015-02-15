'use strict';

// Alumnos controller
angular.module('alumnos').controller('AlumnosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Alumnos', 'Comentarios', 'ngTableParams',
	function($scope, $stateParams, $location, Authentication, Alumnos, Comentarios, NgTableParams) {
		$scope.authentication = Authentication;

		var params = {
			page: 1,            // show first page
        	count: 5
		};

		var settings = {
			total: 0,  
			counts: [5, 10, 20],         // length of data
	        getData: function($defer, params) {
	            // ajax request to api
	            Alumnos.get(params.url(), function(response) {
	                    // update table params
	                    params.total(response.total);
	                    // set new data
	                    $defer.resolve(response.results);
	            	});
	    	}
    	};
		$scope.tableParams = new NgTableParams(params, settings);

		// Create new Alumno
		$scope.create = function() {
			// Create new Alumno object
			var alumno = new Alumnos ({
				nombre: 'test',//thisObject.comentarioNombre,// BlogTitle field from html which safes the content to a angular property.
				apellido: 'test',//thisObject.comentarioApellido, // BlogContent field from html which safes the content to a angular property.
				dni: 'test',//thisObject.comentarioDni,
				direccion: {
					calle: 'test',//thisObject.comentarioCalle, 
					numero: 'test',//thisObject.comentarioNumero, 
					dpto: 'test'//thisObject.comentarioDpto
				}
			});
			alumno.save(function(err, doc){
			   if(err)
			      console.log(err);
			   var comentario = new Comentarios({
			       	name: 'test', //this.name,
					asunto: 'test', //this.asunto,
					contenido: 'test', //this.contenido,
					//alumno: response._id
			   });
			   comentario.save( function(err, doc){
			     console.log(err);
			     console.log(doc);
			   });
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

/*angular.module('alumnos').controller('ComentariosController', function($scope){
	$scope.message = 'This is a scope message';
});*/