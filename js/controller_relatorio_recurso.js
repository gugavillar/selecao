(function () {
	'use strict';
	/*global M, angular, $*/
	function RelatorioRecursoCtrl(Recursos) {
		var vm = this;
		vm.recursos = Recursos;
	}
	RelatorioRecursoCtrl.$inject = ['Recursos'];

	angular.module('SELECAO').controller('RelatorioRecursoCtrl', RelatorioRecursoCtrl);
}());