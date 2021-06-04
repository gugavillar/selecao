(function () {
	'use strict';
	/*global Materialize, angular, $*/

	function ResultadoFinalCtrl(Cargos, ResultadosResource) {
		var vm = this;
		vm.cargos = Cargos;

		$(document).ready(function () {
			$('select').formSelect();
		});

		function orderNC(data) {
			var i = data.length;
			if (i) {
				while (i--) {
					data.forEach(function (elem, index) {
						if (elem.status_avaliacao === '1') {
							data.push(data.splice(index, 1)[0]);
						}
						vm.listaCandidatos = data;
					});
				}
			} else {
				vm.listaCandidatos = [];
			}
		}

		function gerar() {
			vm.dados.data = new Date();
			Cargos.filter(function (elem) {
				if (elem.id_cargo === vm.dados.id_cargo) {
					vm.dados.nome_cargo = elem.nome_cargo;
				}
			});
			ResultadosResource.getFinal().query({ deficiente_cargo: vm.dados.deficiente_candidato, id_cargo: vm.dados.id_cargo }).$promise.then(function (data) {
				data.sort(function (canda, candb) {
					if (canda.pontuacao_avaliacao === candb.pontuacao_avaliacao) {
						console.log('pontuação avaliada iguais');
						if (canda.idade_candidato >= 60 || candb.idade_candidato >= 60) {
							if (canda.dias_candidato === candb.dias_candidato) {
								console.log('quantidade de dias de nascimento iguais com idade superior a 60');
								if (canda.tempo_experiencia_avaliacao === candb.tempo_experiencia_avaliacao) {
									console.log('tempo de experiência profissional iguais com idade superior a 60');
									if (canda.jurado_avaliacao === candb.jurado_avaliacao) {
										console.log('jurado iguais com idade superior a 60');
									} else {
										console.log('jurado diferente com idade superior a 60');
										return candb.jurado_avaliacao - canda.jurado_avaliacao;
									}
								} else {
									console.log('tempo de experiência profissional diferente com idade superior a 60');
									return candb.tempo_experiencia_avaliacao - canda.tempo_experiencia_avaliacao;
								}
							} else {
								console.log('quantidade de dias de nascimento diferente com idade superior a 60');
								return candb.dias_candidato - canda.dias_candidato;
							}
						} else {
							if (canda.tempo_experiencia_avaliacao === candb.tempo_experiencia_avaliacao) {
								console.log('tempo de experiência profissional iguais com idade inferior a 60');
								if (canda.dias_candidato === candb.dias_candidato) {
									console.log('quantidade de dias de nascimento iguais com idade inferior a 60');
									if (canda.jurado_avaliacao === candb.jurado_avaliacao) {
										console.log('jurados iguais com idade inferior a 60');
									} else {
										console.log('jurados diferente com idade inferior a 60');
										return candb.jurado_avaliacao - canda.jurado_avaliacao;
									}
								} else {
									console.log('quantidade de dias de nascimento diferentes com idade inferior a 60');
									return candb.dias_candidato - canda.dias_candidato;
								}
							} else {
								console.log('tempo de experiência profissional diferente com idade inferior a 60');
								return candb.tempo_experiencia_avaliacao - canda.tempo_experiencia_avaliacao;
							}
						}
					} else {
						console.log('pontuação avaliada diferente');
						return candb.pontuacao_avaliacao - canda.pontuacao_avaliacao;
					}
				});
				orderNC(data);
			});
		}
		vm.gerar = gerar;
	}
	ResultadoFinalCtrl.$inject = ['Cargos', 'ResultadosResource'];

	angular.module('SELECAO').controller('ResultadoFinalCtrl', ResultadoFinalCtrl);
}());