(function () {
	'use strict';
	/*global M, angular, $*/
	function UsuarioCtrl(UsuariosResource) {
		var vm = this, copy;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function send() {
			copy = angular.copy(vm.dados);
			delete vm.dados;
			$(document).ready(function () {
				$('select').formSelect();
			});
			UsuariosResource.save(copy).$promise.then(function (data) {
				if (data.id) {
					M.toast({ html: 'Usuário cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					var pattern = /UNICO USUARIO/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Usuário já cadastrado', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.send = send;
	}
	UsuarioCtrl.$inject = ['UsuariosResource'];

	angular.module('SELECAO').controller('UsuarioCtrl', UsuarioCtrl);
}());