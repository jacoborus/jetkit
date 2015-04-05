'use strict';
// from http://stackoverflow.com/a/10741832
var options = {};
var DEFAULT_TIMEOUT = 10000;
var DEFAULT_UPLOAD_TIMEOUT = 1 * 60 * 1000;

/*
Throws an error after the specified request timeout elapses.

Options include:
	- timeout
	- uploadTimeout
	- errorPrototype (the type of Error to throw)
*/


var timer = function (req, res, next) {
	//timeout is the timeout timeout for this request
	var tid, timeout = req.is( 'multipart/form-data' ) ? options.uploadTimeout : options.timeout;
	//Add setTimeout and clearTimeout functions
	req.setTimeout = function (newTimeout) {
		if (newTimeout !== null) {
			timeout = newTimeout; //Reset the timeout for this request
		}
		req.clearTimeout();
		tid = setTimeout( function () {
			if (options.throwError && !res.finished) {
				//throw the error
				var Proto = Error;
				next( new Proto( 'Timeout ' + req.method + ' ' + req.url ));
			}
		}, timeout );
	};

	req.clearTimeout = function() {
		clearTimeout( tid );
	};

	req.getTimeout = function() {
		return timeout;
	};

	//proxy end to clear the timeout
	var oldEnd = res.end;
	res.end = function() {
		req.clearTimeout();
		res.end = oldEnd;
		return res.end.apply( res, arguments );
	};

	//start the timer
	req.setTimeout();
	next();
};



module.exports = function (config) {

	config = config || {};
	// Set options

	options.timeout = config.timeout || DEFAULT_TIMEOUT;
	options.uploadTimeout = config.uploadTimeout || DEFAULT_UPLOAD_TIMEOUT;

	return timer;
};
