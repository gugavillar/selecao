(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaCandidatosCtrl($filter, Candidatos, CandidatosResource) {
		var vm = this;
		vm.check = parseInt(sessionStorage.getItem('type'), 10);
		vm.candidatos = Candidatos;
		vm.config = {
			itemsPerPage: 10,
			fillLastPage: true,
			maxPages: 5,
			paginatorLabels: {
				first: '<<',
				last: '>>',
				stepBack: '<',
				stepAhead: '>'
			}
		};

		$(document).ready(function () {
			$('.tooltipped').tooltip({
				delay: 50
			});
			$('#resposta').modal({
				dismissible: false
			});
		});

		function printComprovante(cpf_candidato) {
			CandidatosResource.getConsultaCandidato().get({ cpf_candidato: cpf_candidato }).$promise.then(function (data) {
				vm.resposta = data;
			});
			$('#resposta').modal('open');
			M.toast({
				html: 'Preparando a impressão', inDuration: 1000, classes: 'rounded noprint', completeCallback: function () {
					window.print();
				}
			});
		}
		vm.printComprovante = printComprovante;

		function search() {
			vm.list = $filter('filter')(Candidatos, { cpf_candidato: vm.query });
		}
		vm.search = search;

	}
	ListaCandidatosCtrl.$inject = ['$filter', 'Candidatos', 'CandidatosResource'];

	angular.module('SELECAO').controller('ListaCandidatosCtrl', ListaCandidatosCtrl);
}());