(function () {
	'use strict';
	/*global M, angular, $*/
	function ListaUsuariosCtrl(Usuarios, UsuariosResource, $state) {
		var vm = this;
		vm.usuarios = Usuarios;
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

		function deleteUser(id) {
			UsuariosResource.delete({ id: id }).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					vm.usuarios = vm.usuarios.filter(function (elem) {
						if (elem.id !== id) {
							return elem;
						}
					});
					M.toast({
						html: 'Usuário excluído com sucesso', inDuration: 2000, classes: 'rounded noprint', completeCallback: function () {
							$state.reload();
						}
					});
				} else {
					M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
				}
			});
		}
		vm.deleteUser = deleteUser;

		function redefinir(usuario) {
			UsuariosResource.update({ id: usuario.id }, usuario).$promise.then(function (data) {
				if (data.$resolved && data[0] === '1') {
					M.toast({ html: 'Senha do usuário redefinida com sucesso', inDuration: 2000, classes: 'rounded noprint' });
				} else {
					M.toast({ html: 'Ocorreu uma falha tente novamente', inDuration: 2000, classes: 'rounded noprint' });
				}
				if (usuario.id === '1') {
					$state.go('login');
				}
			});
		}
		vm.redefinir = redefinir;
	}
	ListaUsuariosCtrl.$inject = ['Usuarios', 'UsuariosResource', '$state'];

	angular.module('SELECAO').controller('ListaUsuariosCtrl', ListaUsuariosCtrl);
}());