(function () {
	'use strict';
	/*global angular*/

	function CPF() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/g, '$1.$2.$3-$4');
				return input;
			}
		};
	}

	function Titulo() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{4})(\d{4})(\d{4})/g, '$1 $2 $3');
				return input;
			}
		};
	}

	function Telefone() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{2})(\d{4,5})(\d{4})/g, '($1) $2-$3');
				return input;
			}
		};
	}

	function Cep() {
		return function (input) {
			if (input) {
				input = input.replace(/^(\d{5})(\d{3})/g, '$1-$2');
				return input;
			}
		};
	}

	function Genero() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'FEMININO';
					default:
						return 'MASCULINO';
				}
			}
		};
	}

	function EstadoCivil() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'SOLTEIRO';
					case '2':
					case 2:
						return 'CASADO';
					case '3':
					case 3:
						return 'VIÚVO';
					case '4':
					case 4:
						return 'SEPARADO';
					default:
						return 'DIVORCIADO';
				}
			}
		};
	}

	function Instrucao() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'ANALFABETO';
					case '2':
					case 2:
						return 'FUNDAMENTAL 1 - INCOMPLETO';
					case '3':
					case 3:
						return 'FUNDAMENTAL 1 - COMPLETO';
					case '4':
					case 4:
						return 'FUNDAMENTAL 2 - INCOMPLETO';
					case '5':
					case 5:
						return 'FUNDAMENTAL 2 - COMPLETO';
					case '6':
					case 6:
						return 'MÉDIO - INCOMPLETO';
					case '7':
					case 7:
						return 'MÉDIO - COMPLETO';
					case '8':
					case 8:
						return 'SUPERIOR - INCOMPLETO';
					case '9':
					case 9:
						return 'SUPERIOR - COMPLETO';
					case '10':
					case 10:
						return 'MESTRADO';
					default:
						return 'DOUTORADO';
				}
			}
		};
	}

	function Deficiencia() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'SIM';
					default:
						return 'NÃO';
				}
			}
		};
	}

	function dataProtocolo(dateFilter) {
		return function (input) {
			if (input) {
				var dados = input.split(' '), data, novaData;
				data = dados[0].split('-');
				novaData = new Date(data[0], data[1] - 1, data[2]);
				return dateFilter(novaData, 'longDate');
			}
		};
	}
	dataProtocolo.$inject = ['dateFilter'];

	function statusRecurso() {
		return function (input) {
			if (input === '1') {
				return 'DEFERIDO';
			} else {
				return 'INDEFERIDO';
			}
		};
	}

	function True() {
		return function (input) {
			if (input === '1') {
				return 'SIM';
			} else {
				return 'NÃO';
			}
		};
	}

	function Tempo() {
		return function (input) {
			if (parseInt(input, 10) > 1) {
				return input + ' Meses';
			} else {
				return input + ' Mês';
			}
		};
	}

	function Percentagem($filter) {
		return function (input, total, decimal) {
			return $filter('number')(input * 100 / total, decimal) + '%';
		};
	}
	Percentagem.$inject = ['$filter'];

	function Classificacao() {
		return function (input) {
			if (input === '2') {
				return 'CLASSIFICADO';
			} else {
				return 'NÃO CLASSIFICADO';
			}
		};
	}

	function userType() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'AVALIADOR';
					case '2':
					case 2:
						return 'DIGITADOR';
					default:
						return 'ADMINISTRADOR';
				}
			}
		};
	}

	function avaliacaoType() {
		return function (input) {
			if (input) {
				switch (input) {
					case '1':
					case 1:
						return 'FUNDAMENTAL';
					case '2':
					case 2:
						return 'MÉDIO';
					default:
						return 'SUPERIOR';
				}
			}
		};
	}

	angular.module('SELECAO').filter('CPF', CPF).filter('Titulo', Titulo).filter('Telefone', Telefone).filter('Cep', Cep).filter('Genero', Genero).filter('EstadoCivil', EstadoCivil).filter('Instrucao', Instrucao).filter('Deficiencia', Deficiencia).filter('dataProtocolo', dataProtocolo).filter('statusRecurso', statusRecurso).filter('Percentagem', Percentagem).filter('True', True).filter('Tempo', Tempo).filter('Classificacao', Classificacao).filter('userType', userType).filter('avaliacaoType', avaliacaoType);
}());