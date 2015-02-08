'use strict';

//Alumnos service used to communicate Alumnos REST endpoints
angular.module('alumnos').factory('Alumnos', ['$resource',
	function($resource) {
		return $resource('alumnos/:alumnoId', { alumnoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);