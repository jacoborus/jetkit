'use strict';

exports.wiretree = function () {

	var mod = {};

	mod.index =  function (req, res, next) {
		res.render('index', {
			title: 'JetKit CMS',
			data: {}
		});
	};

	return mod;
};
