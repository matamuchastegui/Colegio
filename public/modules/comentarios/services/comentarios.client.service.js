'use strict';

//Comentarios service used to communicate Comentarios REST endpoints
angular.module('comentarios').factory('Comentarios', ['$resource',
	function($resource) {
		return $resource('comentarios/:comentarioId', { comentarioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);