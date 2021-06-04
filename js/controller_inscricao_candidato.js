(function () {
	'use strict';
	/*global M, angular, $*/
	function InscricaoCandidatoCtrl(Cargos, CandidatosResource, $http, $state) {
		var vm = this, copy;
		vm.cargos = Cargos;

		$(document).ready(function () {
			$('select').formSelect();
			$('#resposta_cep').modal({
				onCloseEnd: function () {
					delete vm.dados.cep_candidato;
					$('#cep_candidato').val('').focus();
				}
			});
			$('#resposta').modal({
				onCloseEnd: function () {
					$state.reload();
				},
				dismissible: false
			});
		});

		function geraComprovante(cpf_candidato) {
			CandidatosResource.getConsultaCandidato().get({ cpf_candidato: cpf_candidato }).$promise.then(function (data) {
				$('html, body').animate({
					scrollTop: $('#dados_candidato').offset().top
				}, 800);
				vm.resposta = data;
				$('#resposta').modal('open');
				M.toast({
					html: 'Preparando a impressão', inDuration: 1000, classes: 'rounded noprint', completeCallback: function () {
						window.print();
					}
				});
			});
		}

		function getEndereco(cep) {
			if (cep) {
				delete $http.defaults.headers.common.Authorization;
				$http.get('https://viacep.com.br/ws/' + cep + '/json/').then(function (data) {
					var endereco = data;
					if (endereco.data.logradouro) {
						vm.dados.logradouro_candidato = endereco.data.logradouro.toUpperCase();
						vm.dados.bairro_candidato = endereco.data.bairro.toUpperCase();
						vm.dados.cidade_candidato = endereco.data.localidade.toUpperCase();
						vm.dados.estado_candidato = endereco.data.uf.toUpperCase();
						$(document).ready(function () {
							M.updateTextFields();
						});
					} else {
						$('#resposta_cep').modal('open');
					}
				});
			}
		}
		vm.getEndereco = getEndereco;

		function send() {
			vm.dados.usuario_candidato = sessionStorage.getItem('id');
			copy = angular.copy(vm.dados);
			delete vm.dados;
			$http.defaults.headers.common.Authorization = sessionStorage.getItem('token');
			CandidatosResource.getCandidatos().save(copy).$promise.then(function (data) {
				if (data.id_candidato) {
					vm.resposta = data;
					M.toast({
						html: 'Candidato cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint', completeCallback: geraComprovante(data.cpf_candidato)
					});
				} else {
					var pattern1 = /UNICO RG CANDIDATO/g;
					var pattern2 = /UNICO CPF CANDIDATO/g;
					var pattern3 = /UNICO TITULO CANDIDATO/g;
					if (pattern1.test(data.erro)) {
						M.toast({ html: 'RG já cadastrado em outro candidato', inDuration: 1500, classes: 'rounded noprint' });
					} else if (pattern2.test(data.erro)) {
						M.toast({ html: 'CPF já cadastrado em outro candidato', inDuration: 1500, classes: 'rounded noprint' });
					} else if (pattern3.test(data.erro)) {
						M.toast({ html: 'Título já cadastrado em outro candidato', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.send = send;
	}
	InscricaoCandidatoCtrl.$inject = ['Cargos', 'CandidatosResource', '$http', '$state'];

	angular.module('SELECAO').controller('InscricaoCandidatoCtrl', InscricaoCandidatoCtrl);
}());