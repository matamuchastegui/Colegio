'use strict';

//Setting up route
angular.module('materia').config(['$stateProvider',
	function($stateProvider) {
		// Materia state routing
		$stateProvider.
		state('listMateria', {
			url: '/materia',
			templateUrl: 'modules/materia/views/list-materia.client.view.html'
		}).
		state('createMaterium', {
			url: '/materia/create',
			templateUrl: 'modules/materia/views/create-materium.client.view.html'
		}).
		state('viewMaterium', {
			url: '/materia/:materiumId',
			templateUrl: 'modules/materia/views/view-materium.client.view.html'
		}).
		state('editMaterium', {
			url: '/materia/:materiumId/edit',
			templateUrl: 'modules/materia/views/edit-materium.client.view.html'
		});
	}
]);