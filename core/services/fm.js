'use strict';

var Filesaver = require( 'filesaver' ),
	mkdirp = require('mkdirp'),
	path = require('path');

exports.wiretree = function (config, toolsUtil) {

	// create temp folder if not exists
	mkdirp( path.resolve( config.rootPath, config.tempFolder ), function (err) {
		if (err) { throw( err ); }
	});
	var filesaver = new Filesaver({ folders: config.uploadFolders, safenames: true });


	var loopObject = toolsUtil.loopObject;

	var addFn = function (folder, doc) {
		return function (file, next) {
			filesaver.add( folder, file.path, file.name, function (err, datafile) {
				if (err) {
					return next( err );
				}
				doc[file.fieldname] = datafile.filename;
				next();
			});
		};
	};

	var mod = {};

	mod.add = function (folder, files, doc, callback) {
		var fn = addFn( folder, doc );
		loopObject( fn, files || {}, callback );
	};

	return mod;
};
