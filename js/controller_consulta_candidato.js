(function () {
	'use strict';
	/*global M, angular, $*/

	function ConsultaCandidatoCtrl(CandidatosResource) {
		var vm = this;

		$(document).ready(function () {
			$('main').css({
				'padding-left': 0,
				'justify-items': 'center',
				'align-items': 'center'
			});
			$('footer').css({
				'padding-left': 0,
				'justify-items': 'center',
				'align-items': 'center'
			});
		});

		function clear() {
			delete vm.dados;
			delete vm.candidato;
		}

		function buscar() {
			CandidatosResource.getConsultaCandidato().get({ cpf_candidato: vm.dados.cpf_candidato }).$promise.then(function (data) {
				if (!data.id_candidato) {
					M.toast({ html: 'Candidato não localizado', inDuration: 2000, classes: 'rounded noprint', completeCallback: clear() });
				} else {
					vm.candidato = data;
				}
			});
		}
		vm.buscar = buscar;
	}
	ConsultaCandidatoCtrl.$inject = ['CandidatosResource'];

	angular.module('SELECAO').controller('ConsultaCandidatoCtrl', ConsultaCandidatoCtrl);
}());