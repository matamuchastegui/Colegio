'use strict';

//Setting up route
angular.module('alumnos').config(['$stateProvider',
	function($stateProvider) {
		// Alumnos state routing
		$stateProvider.
		state('aluview', {
			url: '/aluview',
			templateUrl: 'modules/alumnos/views/aluview.client.view.html'
		}).
		state('aluroute', {
			url: '/aluroute',
			templateUrl: 'modules/alumnos/views/aluroute.client.view.html'
		}).
		state('listAlumnos', {
			url: '/alumnos',
			templateUrl: 'modules/alumnos/views/list-alumnos.client.view.html'
		}).
		state('createAlumno', {
			url: '/alumnos/create',
			templateUrl: 'modules/alumnos/views/create-alumno.client.view.html'
		}).
		state('viewAlumno', {
			url: '/alumnos/:alumnoId',
			templateUrl: 'modules/alumnos/views/view-alumno.client.view.html'
		}).
		state('editAlumno', {
			url: '/alumnos/:alumnoId/edit',
			templateUrl: 'modules/alumnos/views/edit-alumno.client.view.html'
		});
	}
]);