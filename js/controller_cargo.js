(function () {
	'use strict';
	/*global M, angular, $*/
	function CargoCtrl(CargosResource) {
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
			CargosResource.save(copy).$promise.then(function (data) {
				if (data.id_cargo) {
					M.toast({ html: 'Cargo cadastrado com sucesso', inDuration: 1500, classes: 'rounded noprint' });
				} else {
					var pattern = /UNICO CARGO/g;
					if (pattern.test(data.erro)) {
						M.toast({ html: 'Cargo já cadastrado', inDuration: 1500, classes: 'rounded noprint' });
					} else {
						M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
					}
				}
			});
		}
		vm.send = send;
	}
	CargoCtrl.$inject = ['CargosResource'];

	angular.module('SELECAO').controller('CargoCtrl', CargoCtrl);
}());