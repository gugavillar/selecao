(function () {
	'use strict';
	/*global angular*/
	function LoginResource($resource) {
		function setCred() {
			return $resource('api/login', null, {
				update: { method: 'PUT' }
			});
		}

		function chkCred() {
			var returnVal = false;
			if (sessionStorage.getItem('token')) {
				returnVal = true;
			}
			return returnVal;
		}

		function delCred() {
			sessionStorage.clear();
		}

		return {
			setCred: setCred,
			chkCred: chkCred,
			delCred: delCred
		};
	}
	LoginResource.$inject = ['$resource'];

	function CargosResource($resource) {
		return $resource('api/cargos/:id_cargo');
	}
	CargosResource.$inject = ['$resource'];

	function CandidatosResource($resource) {
		function getCandidatos() {
			return $resource('api/candidatos/:id_candidato');
		}
		function getConsultaCandidato() {
			return $resource('api/candidatos/consulta/:cpf_candidato');
		}
		return {
			getCandidatos: getCandidatos,
			getConsultaCandidato: getConsultaCandidato
		};
	}
	CandidatosResource.$inject = ['$resource'];

	function AvaliacoesResource($resource) {
		return $resource('api/avaliacoes');
	}
	AvaliacoesResource.$inject = ['$resource'];

	function RecursosResource($resource) {
		return $resource('api/recurso');
	}
	RecursosResource.$inject = ['$resource'];

	function ResultadosResource($resource) {
		function getPreliminar() {
			return $resource('api/resultado/preliminar/:deficiente_cargo/:id_cargo');
		}
		function getFinal() {
			return $resource('api/resultado/final/:deficiente_cargo/:id_cargo');
		}

		return {
			getPreliminar: getPreliminar,
			getFinal: getFinal
		};
	}
	ResultadosResource.$inject = ['$resource'];

	function DashboardCandidatosResource($resource) {
		return $resource('api/dashboard/candidatos');
	}
	DashboardCandidatosResource.$inject = ['$resource'];

	function UsuariosResource($resource) {
		return $resource('api/usuarios/:id', null, {
			update: { method: 'PUT' }
		});
	}
	UsuariosResource.$inject = ['$resource'];

	angular.module('SELECAO').factory('LoginResource', LoginResource).factory('CargosResource', CargosResource).factory('CandidatosResource', CandidatosResource).factory('AvaliacoesResource', AvaliacoesResource).factory('RecursosResource', RecursosResource).factory('ResultadosResource', ResultadosResource).factory('DashboardCandidatosResource', DashboardCandidatosResource).factory('UsuariosResource', UsuariosResource);
}());