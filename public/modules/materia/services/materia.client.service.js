'use strict';

//Materia service used to communicate Materia REST endpoints
angular.module('materia').factory('Materia', ['$resource',
	function($resource) {
		return $resource('materia/:materiumId', { materiumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);