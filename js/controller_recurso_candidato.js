(function () {
	'use strict';
	/*global M, angular, $*/
	function RecursoCandidatoCtrl(Candidato, RecursosResource, $state) {
		var vm = this, copy;
		vm.candidato = Candidato;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function go() {
			$state.go('menu.lista_candidatos');
		}

		function send() {
			vm.dados.id_candidato_recurso = vm.candidato.id_candidato;
			vm.dados.usuario_recurso = parseInt(sessionStorage.getItem('id'), 10);
			copy = angular.copy(vm.dados);
			delete vm.dados;
			RecursosResource.save(copy).$promise.then(function (data) {
				if (data.fim_recurso) {
					M.toast({ html: 'Recurso respondido com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: go });
				} else {
					M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
				}
			});
		}
		vm.send = send;
	}
	RecursoCandidatoCtrl.$inject = ['Candidato', 'RecursosResource', '$state'];

	angular.module('SELECAO').controller('RecursoCandidatoCtrl', RecursoCandidatoCtrl);
}());