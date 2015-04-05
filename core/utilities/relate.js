'use strict';
var util = require('util');

// if value is Object return an array with it
var toList = function (item) {
	if (typeof item === 'string' || !util.isArray(item)) {
		item = [item];
	}
	return item;
};


var getRelateConfig = function (list, modelName, op) {
	var arr = [],
		opsList,
		raw, i;

	if (!list[modelName] || !list[modelName][op]) {
		return false;
	}

	opsList = toList( list[modelName][op] );

	for (i in opsList) {
		raw = opsList[i].split(' ');

		arr[i] = {
			slot: raw[0],
			hookModel: raw[1],
			hookField: raw[2]
		};
	}
	return arr;
};

var getRelatedToDocs = function (model, doc, slot, hookField, next) {
	var query = {};
	query[hookField] = doc.id;
	model.find( query )
	.exec( function (err, data) {
		if (err) { return next( err );}
		doc[slot] = data;
		next();
	});
};


var counterCall = function (docs, slot, model, hookField, callback) {
	var c = 0,
		limit = docs.length;

	var next = function (err) {
		if (err) { callback( err );}
		if (++c === limit) {
			callback( null, docs );
		}
	};
	docs.forEach( function (doc) {
		getRelatedToDocs( model, doc, slot, hookField, next );
	});
};


var loop = function (docs, relConfig, mongoose, callback) {
	var c = 0,
		limit = relConfig.length,
		models = [];

	var next = function (err) {
		if (err) { callback( err );}
		if (++c === limit) {
			callback( null, docs );
		}
	};
	var i;
	for (i in relConfig) {
		models[i] = mongoose.models[ relConfig[i].hookModel ];
		counterCall( docs, relConfig[i].slot, models[i], relConfig[i].hookField, next );
	}
};

exports.wiretree = function (config, mongoose) {

	var list = config.relate || {};

	return function (docs, modelName, op, callback) {

		var relConfig = getRelateConfig( list, modelName, op );

		docs = toList( docs );

		if (!relConfig) {
			return callback( null, docs );
		}

		loop( docs, relConfig, mongoose, callback );
	};
};
