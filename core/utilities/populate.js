'use strict';

var toList = function (item) {
	if (typeof item === 'string') {
		item = [item];
	}
	return item;
};

exports.wiretree = function (config) {
	var list = config.population || {};
	return function (model, op) {
		if (list[model] && list[model][op]) {
			return toList( list[model][op] );
		}
		return '';
	};
};
