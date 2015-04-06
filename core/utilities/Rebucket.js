'use strict';

var safename = require('safename'),
	path = require('path');

exports.wiretree = function (config, toolsUtil, FilewareSrv) {

	var uniid = toolsUtil.unifolder;
	//var aws = require('aws-sdk');


	var getExpireTime = function (time) {
	    return new Date( new Date().getTime() + time*60000 );
	};

	var removeOldCreds = function (creds) {
		var now = new Date(),
			i;
		for (i in creds) {
			if (!creds[i].uploading && creds[i].expireDate < now) {
				delete creds[i];
			}
		}
	};

	var Rebucket = function (opts) {
		this.credentials = {};
		this.temporals = {};
		this.opts = opts = opts || {};
		this.path = path.resolve( config.rootPath, opts.path );
		if (opts.s3) {
			throw new Error('S3 is not ready for use');
		} else {
			this.bucket = new FilewareSrv( opts.path, true );
		}
		var self = this;
		setInterval( function () {
			removeOldCreds( self.credentials );
		}, 60000 );
	};


	Rebucket.prototype.getSignedUrl = function (options, callback) {
		var hash = uniid();
		var credential = {
			expireDate: getExpireTime( options.expire ),
			path: hash + '/' + safename( options.filename ),
			contentType: options.contentType,
			hash: hash,
			filename: options.filename
		};
		this.credentials[hash] = credential;
		callback( null, credential );
	};

	// only valid for local storage
	Rebucket.prototype.put = function (origin, destination, callback) {
		this.bucket.put( origin, destination, callback );
	};

	Rebucket.prototype.del = function () {
		// body...
	};

	Rebucket.prototype.list = function () {
		// body...
	};

	return Rebucket;
};

