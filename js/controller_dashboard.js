(function () {
	'use strict';
	/*global Materialize, angular, $*/
	function DashboardCtrl(TotalCandidatos) {
		var vm = this;
		vm.candidatos = TotalCandidatos;
		vm.total_geral = TotalCandidatos.reduce(function (total, valorAtual) {
			return total + parseInt(valorAtual.total_cargo, 10);
		}, 0);
	}
	DashboardCtrl.$inject = ['TotalCandidatos'];

	angular.module('SELECAO').controller('DashboardCtrl', DashboardCtrl);
}());