'use strict';

exports.wiretree = function (config, UserModel, mailerSrv, toolsUtil) {
	var User = UserModel,
		mod = {},
		uniid = toolsUtil.uniid;

	mod.login =  function (req, res, next) {
		res.render('user/login', {
			title: 'Login'
		});
	};

	mod.logout = function (req, res) {
		req.logout();
		delete req.session.profile;
		return res.redirect('/');
	};

	mod.session = function (req, res, next) {
		User.find({
			_id: req.session.passport.user
		}, function (err, data) {
			if (err) {
				next(err);
			} else {
				req.session.profile = data[0];
			}
		});
		res.redirect('/admin');
	};

	mod.signin = function () {};

	mod.authCallback = function (req, res) {
		if (req.session.returnTo) {
			res.redirect(req.session.returnTo);
			delete req.session.returnTo;
			return;
		}
		return res.redirect('/');
	};

	mod.forgotPasswordGet =  function (req, res, next) {
		res.render( 'user/forgot-password', {
			title: 'Forgot password - JetKit CMS',
			data: {}
		});
	};

	mod.forgotPasswordError =  function (req, res, next) {
		res.render( 'user/recover-error', {
			title: 'error recovering password - JetKit CMS',
			data: {}
		});
	};

	mod.forgotPasswordPost =  function (req, res, next) {
		var email = req.body.email,
			doc = User.find({email: email}),
			recoverHash = uniid();

		doc.exec( function (err, data) {
			if (err) { return next( err );}
			if (!data[0]) {
				res.redirect( '/user/recover-error' );
			} else {
				data[0].recoverHash = recoverHash;
				data[0].save( function (err) {
					if (err) {return next(err);}
					mailerSrv.send( 'main', {
						from:    '{{appname}}',
					    to:      '{{username}} <{{email}}>',
					    subject: 'Recover password',
					    html:    '<html>Click <a href="{{recoverHash}}">here</a> to restore your password</html>'
					}, {
						email: email,
						appname: config.seo.appname,
						username: data[0].username,
						recoverHash: config.globalUrl + '/user/restore/' + recoverHash
					}, function (err, msg) {
						if (err) { return next( err );}
						res.redirect( '/user/login' );
					});
				});
			}
		});
	};


	mod.restorePasswordGet =  function (req, res, next) {
		var hash = req.params.hash,
			docs = User.find({ recoverHash: hash });

		docs.exec( function (err, data) {
			if (err) { return next( err );}
			if (!data[0]) {
				return res.redirect( '/user/forgot-error' );
			}
			return res.render( 'user/restore-password', {user: data[0]});
		});
	};

	mod.restorePasswordPost =  function (req, res, next) {
		var hash = req.params.hash,
			pass = req.body.password,
			docs = User.find({ recoverHash: hash });

		docs.exec( function (err, data) {
			if (err) { return next( err );}
			if (!data[0]) {
				return next( 'bad link' );
			} else {
				data[0].password = pass;
				data[0].recoverHash = undefined;
				data[0].save( function (err) {
					if (err) {
						return next(err);
					}
					res.redirect( '/user/password-restored' );
				});
			}
		});
	};

	mod.restoreSuccess = function (req, res, next) {
		res.render( 'user/restore-success' );
	};

	return mod;
};

