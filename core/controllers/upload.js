'use strict';

var safename = require('safename');

exports.wiretree = function (config, publicBucket) {

	var mod = {};

	mod.sign =  function (req, res, next) {
		var options = {
			filename: req.body.filename,
			expireDate: 1
		};
	    publicBucket.getSignedUrl( options, function (err, data) {
	        if (err) { return next( err );}
	        else {
	            res.json( data );
	            res.end();
	        }
	    });
	};

	mod.upload = function (req, res, next) {
		var credential = publicBucket.credentials[req.params.hash],
			origin = req.files.file.path,
			destiny = publicBucket.path + '/' + req.params.hash + '/' + safename.low( credential.filename ),
			filetype = req.files.file.mimetype,
			img = false;
			if (filetype.split('/')[0] === 'image') {
				img = true;
			};

		publicBucket.put( origin, destiny, function (err, data) {
			if (err) { return next( err );}
			res.json({
				ok: true,
				data: {
					filename: data.filename,
					filepath: credential.hash + '/' + data.filename,
					hash: credential.hash,
					filetype: filetype,
					image: img
				}
			});
		});
	};

	return mod;
};
