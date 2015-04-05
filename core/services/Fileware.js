'use strict';

var fs = require('fs'),
	safename = require('safename'),
	path = require('path'),
	mkdirp = require('mkdirp');
/*!
 * Rename file and launch callback
 * @param  {String}   oldPath  path to file to move
 * @param  {String}   newPath  path of destination
 * @param  {Function} callback signature: null, {filename, filepath}
 */
var move = function (oldPath, newPath, callback) {
	var folder = path.dirname( newPath );
	mkdirp( folder, function (err) {
		if (err) { callback( err );}
		fs.rename( oldPath, newPath, function (err) {
			if (err) { return callback( err );}

			callback( null, {
				filename: newPath.split( '/' ).pop(),
				filepath: newPath
			});
		});
	});
};


var Fileware = function (folderPath, safenames) {
	this.path = folderPath;
	this.safenames = safenames;
};

/**
 * Write or overwrite file
 *
 * Example:
 *
 * ```js
 * filesaver.put( 'images', '/path/temp/file.jpg', 'photo.jpg', function (err, data) {
 *     console.log( data );
 *     // ->
 *     // filename: 'photo.jpg',
 *     // filepath: './images/photo.jpg'
 *     });
 * ```
 *
 * @param  {String}   folder     name of parent folder folder
 * @param  {String}   oldPath     path to origin file
 * @param  {String}   newPath     name of newPath file
 * @param  {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Fileware.prototype.put = function (oldPath, newPath, callback) {
	move( oldPath, newPath, callback );
};

Fileware.prototype.del = function (filename, callback) {
	// body...
};

module.exports = Fileware;
