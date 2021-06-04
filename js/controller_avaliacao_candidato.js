(function () {
	'use strict';
	/*global M, angular, $*/
	function AvaliacaoCandidatoCtrl(Candidato, AvaliacoesResource, $state) {
		var vm = this, copy;
		vm.candidato = Candidato;

		function go() {
			$state.go('menu.lista_candidatos');
		}

		function send() {
			vm.dados.id_candidato_avaliacao = vm.candidato.id_candidato;
			vm.dados.avaliacao_cargo = vm.candidato.avaliacao_cargo;
			vm.dados.usuario_avaliacao = parseInt(sessionStorage.getItem('id'), 10);
			vm.dados.status_avaliacao = 2;
			copy = angular.copy(vm.dados);
			delete vm.dados;
			AvaliacoesResource.save(copy).$promise.then(function (data) {
				if (data.fim_avaliacao) {
					M.toast({ html: 'Avaliação do candidato realizada', inDuration: 2000, classes: 'rounded noprint', completeCallback: go });
				} else {
					M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
				}
			});
		}
		vm.send = send;

		function avaliacao(valor) {
			if (valor) {
				vm.show = true;
				$(document).ready(function () {
					$('select').formSelect();
				});
			} else {
				vm.dados = { id_candidato_avaliacao: vm.candidato.id_candidato };
				vm.dados.usuario_avaliacao = parseInt(sessionStorage.getItem('id'), 10);
				vm.dados.status_avaliacao = 1;
				copy = angular.copy(vm.dados);
				delete vm.dados;
				AvaliacoesResource.save(copy).$promise.then(function (data) {
					if (data.fim_avaliacao) {
						M.toast({ html: 'O candidato foi desclassificado', inDuration: 2000, classes: 'rounded noprint', completeCallback: go });
					} else {
						M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
					}
				});
			}
		}
		vm.avaliacao = avaliacao;
	}
	AvaliacaoCandidatoCtrl.$inject = ['Candidato', 'AvaliacoesResource', '$state'];

	angular.module('SELECAO').controller('AvaliacaoCandidatoCtrl', AvaliacaoCandidatoCtrl);
}());