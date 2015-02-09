'use strict';

//Parcials service used to communicate Parcials REST endpoints
angular.module('parcials').factory('Parcials', ['$resource',
	function($resource) {
		return $resource('parcials/:parcialId', { parcialId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);