'use strict';


var multer  = require('multer'),
	path = require('path');


exports.wiretree = function (app, config, uploadControl, publicBucket, wtDone) {
	var tempFolder = path.resolve( config.rootPath, config.tempFolder );
	var mwMulter1 = multer({ dest: tempFolder });

	var checkCredential = function (req, res, next) {
		var cred = publicBucket.credentials[req.params.hash];

		if (!cred || cred.expires > new Date()) {
			return next( 403 );
		}
		cred.uploading = true;
		next();
	};

	app.route( '/_upload/sign' ).post( uploadControl.sign );
	app.route( '/_upload/put/:hash' ).post( checkCredential, mwMulter1, uploadControl.upload );
	wtDone();
};