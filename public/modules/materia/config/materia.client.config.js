'use strict';

// Configuring the Articles module
angular.module('materia').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Materia', 'materia', 'dropdown', '/materia(/create)?');
		Menus.addSubMenuItem('topbar', 'materia', 'List Materia', 'materia');
		Menus.addSubMenuItem('topbar', 'materia', 'New Materium', 'materia/create');
	}
]);