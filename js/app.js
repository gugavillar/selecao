(function () {
	'use strict';
	/*global angular, $*/

	function getCargos(CargosResource) {
		return CargosResource.query().$promise;
	}
	getCargos.$inject = ['CargosResource'];

	function getCandidatos(CandidatosResource) {
		return CandidatosResource.getCandidatos().query().$promise;
	}
	getCandidatos.$inject = ['CandidatosResource'];

	function getCandidato(CandidatosResource, $stateParams) {
		return CandidatosResource.getConsultaCandidato().get({ cpf_candidato: $stateParams.cpf_candidato }).$promise;
	}
	getCandidato.$inject = ['CandidatosResource', '$stateParams'];

	function getRecursos(RecursosResource) {
		return RecursosResource.query().$promise;
	}
	getRecursos.$inject = ['RecursosResource'];

	function getTotalCandidatos(DashboardCandidatosResource) {
		return DashboardCandidatosResource.query().$promise;
	}
	getTotalCandidatos.$inject = ['DashboardCandidatosResource'];

	function getUsuarios(UsuariosResource) {
		return UsuariosResource.query().$promise;
	}
	getUsuarios.$inject = ['UsuariosResource'];

	function configuration($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('menu', {
				url: '/menu',
				templateUrl: 'dist/partials/menu.html',
				controller: 'MenuCtrl as menu',
				abstract: true,
				data: {
					auth: true
				}
			})
			.state('menu.inscricao_candidato', {
				url: '/inscricao_candidato',
				templateUrl: 'dist/partials/inscricao_candidato.html',
				controller: 'InscricaoCandidatoCtrl as form',
				data: {
					auth: true
				},
				resolve: {
					Cargos: getCargos
				}
			})
			.state('menu.detalhe_candidato', {
				url: '/detalhe_candidato/:cpf_candidato',
				templateUrl: 'dist/partials/detalhe_candidato.html',
				controller: 'DetalheCandidatoCtrl as detalhe',
				data: {
					auth: true
				},
				resolve: {
					Candidato: getCandidato
				}
			})
			.state('menu.avaliacao_candidato', {
				url: '/avaliacao_candidato/:cpf_candidato',
				templateUrl: 'dist/partials/avaliacao_candidato.html',
				controller: 'AvaliacaoCandidatoCtrl as avaliacao',
				data: {
					auth: true
				},
				resolve: {
					Candidato: getCandidato
				}
			})
			.state('menu.recurso_candidato', {
				url: '/recurso_candidato/:cpf_candidato',
				templateUrl: 'dist/partials/recurso_candidato.html',
				controller: 'RecursoCandidatoCtrl as recurso',
				data: {
					auth: true
				},
				resolve: {
					Candidato: getCandidato
				}
			})
			.state('menu.lista_candidatos', {
				url: '/lista_candidatos',
				templateUrl: 'dist/partials/lista_candidatos.html',
				controller: 'ListaCandidatosCtrl as lista',
				data: {
					auth: true
				},
				resolve: {
					Candidatos: getCandidatos
				}
			})
			.state('menu.relatorio_inscritos', {
				url: '/relatorio_inscritos',
				templateUrl: 'dist/partials/relatorio_inscritos.html',
				controller: 'ListaCandidatosCtrl as relatorio',
				data: {
					auth: true
				},
				resolve: {
					Candidatos: getCandidatos
				}
			})
			.state('menu.relatorio_recurso', {
				url: '/relatorio_recurso',
				templateUrl: 'dist/partials/relatorio_recurso.html',
				controller: 'RelatorioRecursoCtrl as relatorio',
				data: {
					auth: true
				},
				resolve: {
					Recursos: getRecursos
				}
			})
			.state('menu.resultado_preliminar', {
				url: '/resultado_preliminar',
				templateUrl: 'dist/partials/resultado_preliminar.html',
				controller: 'ResultadoPreliminarCtrl as resultado',
				data: {
					auth: true
				},
				resolve: {
					Cargos: getCargos
				}
			})
			.state('menu.resultado_final', {
				url: '/resultado_final',
				templateUrl: 'dist/partials/resultado_final.html',
				controller: 'ResultadoFinalCtrl as resultado',
				data: {
					auth: true
				},
				resolve: {
					Cargos: getCargos
				}
			})
			.state('menu.novo_usuario', {
				url: '/novo_usuario',
				templateUrl: 'dist/partials/novo_usuario.html',
				controller: 'UsuarioCtrl as usuario',
				data: {
					auth: true
				}
			})
			.state('menu.lista_usuarios', {
				url: '/lista_usuarios',
				templateUrl: 'dist/partials/lista_usuarios.html',
				controller: 'ListaUsuariosCtrl as lista',
				data: {
					auth: true
				},
				resolve: {
					Usuarios: getUsuarios
				}
			})
			.state('menu.novo_cargo', {
				url: '/novo_cargo',
				templateUrl: 'dist/partials/novo_cargo.html',
				controller: 'CargoCtrl as cargo',
				data: {
					auth: true
				}
			})
			.state('menu.lista_cargos', {
				url: '/lista_cargos',
				templateUrl: 'dist/partials/lista_cargos.html',
				controller: 'ListaCargosCtrl as lista',
				data: {
					auth: true
				},
				resolve: {
					Cargos: getCargos
				}
			})
			.state('menu.dashboard', {
				url: '/dashboard',
				templateUrl: 'dist/partials/dashboard.html',
				controller: 'DashboardCtrl as dash',
				data: {
					auth: true
				},
				resolve: {
					TotalCandidatos: getTotalCandidatos
				}
			})
			.state('login', {
				url: '/login',
				templateUrl: 'dist/partials/login.html',
				controller: 'LoginCtrl as login',
				data: {
					auth: false
				}
			})
			.state('consulta_candidato', {
				url: '/consulta_candidato',
				templateUrl: 'dist/partials/consulta_candidato.html',
				controller: 'ConsultaCandidatoCtrl as consulta',
				data: {
					auth: false
				}
			});
		$urlRouterProvider.otherwise('/login');
	}
	configuration.$inject = ['$stateProvider', '$urlRouterProvider'];

	function runner($rootScope, $state, LoginResource) {
		$rootScope.$on('$stateChangeStart', function (event, toState) {
			if (toState.data.auth && !LoginResource.chkCred()) {
				event.preventDefault();
				$state.go('login');
			}
		});
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
			$('.tooltipped').tooltip('close');
			$state.previous = fromState;
		});
	}
	runner.$inject = ['$rootScope', '$state', 'LoginResource'];

	angular.module('SELECAO', ['ui.router', 'ngResource', 'angular-table', 'monospaced.elastic']).config(configuration).run(runner);
}());