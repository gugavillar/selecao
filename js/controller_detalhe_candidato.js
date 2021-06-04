(function () {
	'use strict';
	/*global M, angular, $*/
	function DetalheCandidatoCtrl(Candidato) {
		var vm = this;
		vm.candidato = Candidato;
	}
	DetalheCandidatoCtrl.$inject = ['Candidato'];

	angular.module('SELECAO').controller('DetalheCandidatoCtrl', DetalheCandidatoCtrl);
}());