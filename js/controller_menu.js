(function () {
	'use strict';
	/*global Materialize, angular, $*/
	function MenuCtrl(LoginResource, $state) {
		var vm = this;
		vm.check = parseInt(sessionStorage.getItem('type'), 10);

		$(document).ready(function () {
			$('.sidenav').sidenav({
				draggable: true
			});
			$('.collapsible').collapsible();
			$('footer').css({
				'padding-left': 300
			});
		});

		function logout() {
			LoginResource.delCred();
			$state.go('login');
		}
		vm.logout = logout;
	}
	MenuCtrl.$inject = ['LoginResource', '$state'];

	angular.module('SELECAO').controller('MenuCtrl', MenuCtrl);
}());