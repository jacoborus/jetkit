'use strict';

var passport = require('passport');

module.exports.wiretree = function (app, userControl, wtDone) {

	app.route( '/user/login' ).get( userControl.login );
	app.route( '/user/logout' ).get( userControl.logout );
	app.route( '/user/login' ).post( passport.authenticate( 'local', {
		failureRedirect: '/user/login',
		failureFlash: 'Invalid email or password.'
	}), userControl.session );

	app.route( '/user/forgot-password' ).get( userControl.forgotPasswordGet );
	app.route( '/user/forgot-password' ).post( userControl.forgotPasswordPost );
	app.route( '/user/forgot-error' ).get( userControl.forgotPasswordError );
	app.route( '/user/restore/:hash' ).get( userControl.restorePasswordGet );
	app.route( '/user/restore/:hash' ).post( userControl.restorePasswordPost );
	app.route( '/user/password-restored' ).get( userControl.restoreSuccess );

	wtDone();
};
