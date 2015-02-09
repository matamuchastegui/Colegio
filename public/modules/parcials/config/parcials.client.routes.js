'use strict';

//Setting up route
angular.module('parcials').config(['$stateProvider',
	function($stateProvider) {
		// Parcials state routing
		$stateProvider.
		state('listParcials', {
			url: '/parcials',
			templateUrl: 'modules/parcials/views/list-parcials.client.view.html'
		}).
		state('createParcial', {
			url: '/parcials/create',
			templateUrl: 'modules/parcials/views/create-parcial.client.view.html'
		}).
		state('viewParcial', {
			url: '/parcials/:parcialId',
			templateUrl: 'modules/parcials/views/view-parcial.client.view.html'
		}).
		state('editParcial', {
			url: '/parcials/:parcialId/edit',
			templateUrl: 'modules/parcials/views/edit-parcial.client.view.html'
		});
	}
]);