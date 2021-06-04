(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaCargosCtrl(Cargos, CargosResource, $state) {
		var vm = this;
		vm.cargos = Cargos;
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

		function deleteCargo(id) {
			CargosResource.delete({ id_cargo: id }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.cargos = vm.cargos.filter(function (elem) {
						if (elem.id_cargo !== id) {
							return elem;
						}
					});
					M.toast({
						html: 'Cargo excluído com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: function () {
							$state.reload();
						}
					});
				} else {
					M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
				}
			});
		}
		vm.deleteCargo = deleteCargo;

	}
	ListaCargosCtrl.$inject = ['Cargos', 'CargosResource', '$state'];

	angular.module('SELECAO').controller('ListaCargosCtrl', ListaCargosCtrl);
}());