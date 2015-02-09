'use strict';

//Asistencia service used to communicate Asistencia REST endpoints
angular.module('asistencia').factory('Asistencia', ['$resource',
	function($resource) {
		return $resource('asistencia/:asistenciumId', { asistenciumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);