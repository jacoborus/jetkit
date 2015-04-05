'use strict';
// Get dependencies
var mailer = require('curlymail');

exports.wiretree = function (EmailModel) {

	// load emails from DB on app start
	EmailModel
	.find({})
	.exec( function (err, data) {
		if (err) { throw err; }
		data.forEach( function (email) {
			mailer.addAccount( email.account, email );
		});
	});

	return mailer;
};
