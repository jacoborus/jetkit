'use strict';

var winston = require('winston'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	fs = require('fs');
/*
Usage:
	log.info("127.0.0.1 - there's no place like home");
	log.warn("127.0.0.1 - there's no place like home");
	log.error("127.0.0.1 - there's no place like home");
*/

exports.wiretree = function (config) {

	var logPath = path.resolve( config.rootPath , config.logPath );

	// create logPath if not exists
	fs.exists( logPath, function (exists) {
		if (!exists) {
			mkdirp( logPath, function (err) {
				if (err) {throw( err );}
			});
		}
	});

	// Return string number with zero if necessary
	var zeros = function (num) {
		return (num < 10) ? '0' + num.toString() : num;
	};

	// Return today log file name, format: path/to/file/YYYY-MM-DD.log
	var renow = function () {
		var now = new Date();
		return path.resolve( logPath,
			now.getFullYear() + '-' + zeros( now.getMonth()) + '-' + zeros( now.getDate()) + '.log'
		);
	};

	winston.add(
		winston.transports.File,
		{ filename: renow() }
	);
	return winston;
};
