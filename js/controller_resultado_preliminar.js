(function () {
	'use strict';
	/*global M, angular, $*/
	function ResultadoPreliminarCtrl(Cargos, ResultadosResource) {
		var vm = this;
		vm.cargos = Cargos;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function gerar() {
			vm.dados.data = new Date();
			Cargos.filter(function (elem) {
				if (elem.id_cargo === vm.dados.id_cargo) {
					vm.dados.nome_cargo = elem.nome_cargo;
				}
			});
			ResultadosResource.getPreliminar().query({ deficiente_cargo: vm.dados.deficiente_candidato, id_cargo: vm.dados.id_cargo }).$promise.then(function (data) {
				vm.listaCandidatos = data;
			});
		}
		vm.gerar = gerar;
	}
	ResultadoPreliminarCtrl.$inject = ['Cargos', 'ResultadosResource'];

	angular.module('SELECAO').controller('ResultadoPreliminarCtrl', ResultadoPreliminarCtrl);
}());