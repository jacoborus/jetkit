'use strict';

var cleanQuery = function (query) {
	var prop, val;
	for (prop in query) {
		val = query[prop];
		if (val === '') {
			delete query[prop];
		}
	}
	return query;
};

exports.wiretree = function (models, relateUtil) {

	var mod = {},
		relate = relateUtil;

	mod.create = function (modelName, body,	callback) {
		var doc = new models[ modelName ]( body );

		doc.save( function (err, data) {
			if (err) {
				return callback( err );
			}
			callback( null, data );
		});
	};

	mod.read = function (modelName, id, population, callback) {
		var cb, populate, doc, p;

		if (typeof population === 'function') {
			cb = population;
			populate = [];
		} else if (typeof population === 'object') {
			cb = callback;
			populate = population;
		} else {
			throw new Error('cruds.read:: bad options argument');
		}

		doc = models[modelName].findById(id);

		for (p in populate) {
			doc = doc.populate( populate[p] );
		}

		doc.exec( function (err, data) {
			if (err) { return cb( err );}

			relate( data, modelName, 'read', function (err2, doc) {
				if (err) { return cb( err2 );}
				cb( null, doc[0] );
			});
		});
	};

	mod.update = function (id, modelName, body,	callback) {
		models[ modelName ].findById( id, function (err, doc) {
			var i;
			for (i in body) {
				doc[i] = body[i];
			}
			doc.save( function (err, data) {
				if (err) {
					return callback( err );
				}
				callback( null, data );
			});
		});
	};

	mod.destroy = function (id, modelName, callback) {
		models[modelName].findByIdAndRemove( id, callback);
	};

	mod.search = function (modelName, query, options, callback) {
		var cb, populate, select, docs, p;

		if (typeof options === 'function') {
			cb = options;
			populate = [];
			select = null;
		} else if (typeof options === 'object') {
			cb = callback;
			populate = options.population || [];
			select = options.select || null;
		} else {
			throw new Error('cruds.read:: bad options argument');
		}

		query = cleanQuery( query );
		docs = models[modelName].find( query, select );

		for (p in populate) {
			docs = docs.populate( populate[p] );
		}

		docs.exec( function (err, data) {
			if (err) { return callback( err );}
			callback( null, data );
		});
	};

	return mod;
};

