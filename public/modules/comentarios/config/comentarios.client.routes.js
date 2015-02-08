'use strict';

//Setting up route
angular.module('comentarios').config(['$stateProvider',
	function($stateProvider) {
		// Comentarios state routing
		$stateProvider.
		state('listComentarios', {
			url: '/comentarios',
			templateUrl: 'modules/comentarios/views/list-comentarios.client.view.html'
		}).
		state('createComentario', {
			url: '/comentarios/create',
			templateUrl: 'modules/comentarios/views/create-comentario.client.view.html'
		}).
		state('viewComentario', {
			url: '/comentarios/:comentarioId',
			templateUrl: 'modules/comentarios/views/view-comentario.client.view.html'
		}).
		state('editComentario', {
			url: '/comentarios/:comentarioId/edit',
			templateUrl: 'modules/comentarios/views/edit-comentario.client.view.html'
		});
	}
]);