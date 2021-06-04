(function () {
	'use strict';
	/*global angular*/
	function _fieldText(text) {
		if (text) {
			return text.toUpperCase();
		}
	}

	function _viewText(text) {
		if (text) {
			return text.toUpperCase().trim();
		}
	}

	function _uppercase(scope, element, attrib, controller) {
		attrib.ngTrim = 'false';
		element.bind('keyup', function () {
			controller.$setViewValue(_fieldText(element.val()));
			controller.$render();
		});
		controller.$parsers.unshift(_viewText);
		controller.$formatters.unshift(_viewText);
	}

	function uppercase() {
		var directive = {
			link: _uppercase,
			restrict: 'A',
			require: 'ngModel'
		};
		return directive;
	}

	function _viewNum(num) {
		if (num) {
			num = num.replace(/\D/g, '');
			return num;
		}
	}

	function _modelNum(num) {
		if (num) {
			return num.replace(/\D/g, '');
		}
	}

	function _uinum(scope, element, attrib, controller) {
		element.bind('keyup', function () {
			controller.$setViewValue(_viewNum(element.val()));
			controller.$render();
		});
		controller.$parsers.unshift(_modelNum);
		controller.$formatters.unshift(_viewNum);
	}

	function uinum() {
		var directive = {
			link: _uinum,
			restrict: 'A',
			require: 'ngModel'
		};
		return directive;
	}

	function _modelDate(date) {
		var dateArray = date.split('/');
		return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
	}

	function _viewDate(date) {
		if (date && date !== '0000-00-00') {
			var dateArray = date.split('-');
			return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0];
		}
	}

	function _fieldDate(date) {
		if (date) {
			date = date.replace(/\D/g, '');
			if (date.substring(0, 2) > '31') {
				date = '';
			}
			date = date.replace(/(\d{2})(\d)/, '$1/$2');
			if (date.substring(3, 5) > '12') {
				date = date.substring(0, 3);
			}
			date = date.replace(/(\d{2})(\d)/, '$1/$2');
			date = date.replace(/(\d{4})/, '$1');
			return date;
		}
	}

	function _uidate(scope, element, attrib, controller) {
		element.bind('keyup', function () {
			controller.$setViewValue(_fieldDate(element.val()));
			controller.$render();
		});
		controller.$parsers.unshift(_modelDate);
		controller.$formatters.unshift(_viewDate);
	}

	function uidate() {
		var directive = {
			link: _uidate,
			restrict: 'A',
			require: 'ngModel'
		};
		return directive;
	}

	function _viewPhone(phone) {
		if (phone) {
			phone = phone.replace(/\D/g, '');
			phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2');
			phone = phone.replace(/(\d)(\d{4})$/, '$1-$2');
			return phone;
		}
	}

	function _modelPhone(phone) {
		if (phone) {
			return phone.replace(/\D/g, '');
		}
	}

	function _uiphone(scope, element, attrib, controller) {
		element.bind('keyup', function () {
			controller.$setViewValue(_viewPhone(element.val()));
			controller.$render();
		});
		controller.$parsers.unshift(_modelPhone);
		controller.$formatters.push(_viewPhone);
	}

	function uiphone() {
		var directive = {
			link: _uiphone,
			restrict: 'A',
			require: 'ngModel'
		};
		return directive;
	}

	function _viewDoc(doc) {
		if (doc) {
			doc = doc.replace(/\D/g, '');
			doc = doc.replace(/(\d{3})(\d)/, '$1.$2');
			doc = doc.replace(/(\d{3})(\d)/, '$1.$2');
			doc = doc.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
			return doc;
		}
	}

	function _modelDoc(doc) {
		return doc.replace(/\D/g, '');
	}

	function _uidoc(scope, element, attrib, controller) {
		element.bind('keyup', function () {
			controller.$setViewValue(_viewDoc(element.val()));
			controller.$render();
		});
		controller.$parsers.unshift(_modelDoc);
		controller.$formatters.unshift(_viewDoc);
	}

	function uidoc() {
		var directive = {
			link: _uidoc,
			restrict: 'A',
			require: 'ngModel'
		};
		return directive;
	}

	function _viewCep(cep) {
		if (cep) {
			cep = cep.replace(/\D/g, '');
			cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
			return cep;
		}
	}

	function _modelCep(cep) {
		cep = cep.replace(/\D/g, '');
		return cep;
	}

	function _uicep(scope, element, attrib, controller) {
		element.bind('keyup', function () {
			controller.$setViewValue(_viewCep(element.val()));
			controller.$render();
		});
		controller.$parsers.unshift(_modelCep);
		controller.$formatters.unshift(_viewCep);
	}

	function uicep() {
		var directive = {
			link: _uicep,
			restrict: 'A',
			require: 'ngModel'
		};
		return directive;
	}

	function _viewTitulo(titulo) {
		if (titulo) {
			titulo = titulo.replace(/\D/g, '');
			titulo = titulo.replace(/^(\d{4})(\d{4})(\d{4})/g, '$1 $2 $3');
			return titulo;
		}
	}

	function _modelTitulo(titulo) {
		if (titulo) {
			return titulo.replace(/\D/g, '');
		}
	}

	function _uititulo(scope, element, attrib, controller) {
		element.bind('keyup', function () {
			controller.$setViewValue(_viewTitulo(element.val()));
			controller.$render();
		});
		controller.$parsers.unshift(_modelTitulo);
		controller.$formatters.push(_viewTitulo);
	}

	function uititulo() {
		var directive = {
			link: _uititulo,
			restrict: 'A',
			require: 'ngModel'
		};
		return directive;
	}

	function _viewEmissor(emissor) {
		if (emissor) {
			emissor = emissor.toUpperCase();
			emissor = emissor.replace(/^([A-Z]{3})([A-Z])/g, '$1/$2');
			return emissor;
		}
	}

	function _modelEmissor(emissor) {
		if (emissor) {
			return emissor.toUpperCase().trim();
		}
	}

	function _uiemissor(scope, element, attrib, controller) {
		attrib.ngTrim = 'false';
		element.bind('keyup', function () {
			controller.$setViewValue(_viewEmissor(element.val()));
			controller.$render();
		});
		controller.$parsers.unshift(_modelEmissor);
		controller.$formatters.unshift(_viewEmissor);
	}

	function uiemissor() {
		var directive = {
			link: _uiemissor,
			restrict: 'A',
			require: 'ngModel'
		};
		return directive;
	}

	angular.module('SELECAO').directive('uppercase', uppercase).directive('uinum', uinum).directive('uidate', uidate).directive('uiphone', uiphone).directive('uidoc', uidoc).directive('uicep', uicep).directive('uititulo', uititulo).directive('uiemissor', uiemissor);
}());