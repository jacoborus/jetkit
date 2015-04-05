'use strict';

/**
 * UniqueIDs
 * Return unique IDs
 * @return {String} unique hash
 * @api public
 */
var uniid = function () {
	var s4 = function () {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	};
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	 s4() + '-' + s4() + s4() + s4();
};

/**
 * Unique folder id (AWS S3 commpatible)
 * Return unique IDs
 * @return {String} unique hash
 * @api public
 */
var unifolder = function () {
	var s4 = function () {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	};
	return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
};

// Very custom async series function with array
var loopArray = function (fn, arr, callback) {
	var limit = arr.length - 1,
		cur = 0; // pointer

	var iterate = function (err) {
		if (err) { return callback( err );}
		if (cur === limit) {
			return callback();
		}
		fn( arr[++cur], iterate );
	};
};

// Very custom async series function with object
var loopObject = function (fn, obj, callback) {

	var limit = Object.keys( obj ).length,
		cur = 0,
		arr = [], i;

	// pointer
	for (i in obj) {
		arr.push( i );
	}

	var iterate = function (err) {
		if (err) { return callback( err );}
		if (cur === limit) {
			return callback();
		}
		fn( obj[arr[cur++]], iterate );
	};

	iterate();
};

module.exports = {
	uniid : uniid,
	unifolder : unifolder,
	loopArray: loopArray,
	loopObject: loopObject
};
