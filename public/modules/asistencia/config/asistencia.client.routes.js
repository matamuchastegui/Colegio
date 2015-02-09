'use strict';

//Setting up route
angular.module('asistencia').config(['$stateProvider',
	function($stateProvider) {
		// Asistencia state routing
		$stateProvider.
		state('listAsistencia', {
			url: '/asistencia',
			templateUrl: 'modules/asistencia/views/list-asistencia.client.view.html'
		}).
		state('createAsistencium', {
			url: '/asistencia/create',
			templateUrl: 'modules/asistencia/views/create-asistencium.client.view.html'
		}).
		state('viewAsistencium', {
			url: '/asistencia/:asistenciumId',
			templateUrl: 'modules/asistencia/views/view-asistencium.client.view.html'
		}).
		state('editAsistencium', {
			url: '/asistencia/:asistenciumId/edit',
			templateUrl: 'modules/asistencia/views/edit-asistencium.client.view.html'
		});
	}
]);