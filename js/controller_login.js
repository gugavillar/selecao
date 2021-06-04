(function () {
	'use strict';
	/*global Materialize, angular, $*/
	function LoginCtrl(LoginResource, $state, $http) {
		var vm = this;
		LoginResource.delCred();

		$(document).ready(function () {
			$('#mudar').modal();
			$('main').css({
				'padding-left': 0,
				'display': 'grid',
				'justify-items': 'center',
				'align-items': 'center'
			});
			$('footer').css({
				'padding-left': 0,
				'justify-items': 'center',
				'align-items': 'center'
			});
		});

		function reload() {
			$state.reload();
		}

		function entrar() {
			LoginResource.setCred().save(vm.dados).$promise.then(function (data) {
				if (data.status === '0') {
					delete vm.dados;
					M.toast({ html: 'Usuário bloqueado', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload });
				} else if (data.flag === '0') {
					vm.dados.id = data.id;
					delete vm.dados.pass;
					$('#mudar').modal('open');
				} else if (data.token) {
					delete vm.dados;
					$http.defaults.headers.common.Authorization = data.token;
					sessionStorage.setItem('token', data.token);
					sessionStorage.setItem('id', data.id);
					sessionStorage.setItem('type', data.type);
					$state.go('menu.lista_candidatos');
				} else {
					M.toast({ html: 'Usuário e Senha inválidos', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload });
				}
			});
		}
		vm.entrar = entrar;

		function change() {
			$('#mudar').modal('close');
			LoginResource.setCred().update({ id: vm.dados.id }, vm.dados).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({ html: 'Senha alterada com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload });
				} else {
					M.toast({ html: 'Ocorreu uma falha', inDuration: 2000, classes: 'rounded noprint', completeCallback: reload });
				}
			});
		}
		vm.change = change;
	}
	LoginCtrl.$inject = ['LoginResource', '$state', '$http'];

	angular.module('SELECAO').controller('LoginCtrl', LoginCtrl);
}());