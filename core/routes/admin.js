'use strict';

var reqAdmin = function (req, res, next) {
	if (req.session.profile && req.session.profile.rol === 'admin') {
		next();
	} else {
		res.redirect('/user/login');
	}
};

module.exports.wiretree = function (app, adminControl, models, wtDone) {

	/* ---   ADMIN PANEL   --- */
	app.route( '/admin' ).get( reqAdmin, adminControl.index );
	// collection docs
	app.route( '/admin/collection/:model' ).get( reqAdmin, adminControl.collection.search );
	app.route( '/admin/collection/:model/new' ).get( reqAdmin, adminControl.collection.new );
	app.route( '/admin/collection/:model' ).post( reqAdmin, adminControl.collection.create );
	app.route( '/admin/collection/:model/:id' ).get( reqAdmin, adminControl.collection.read );
	app.route( '/admin/collection/:model/:id/edit' ).get( reqAdmin, adminControl.collection.edit );
	app.route( '/admin/collection/:model/:id' ).put( reqAdmin, adminControl.collection.update );
	app.route( '/admin/collection/:model/:id' ).delete( reqAdmin, adminControl.collection.destroy );
	// single docs
	app.route( '/admin/single/:model' ).get( reqAdmin, adminControl.single.edit );
	app.route( '/admin/single/:model' ).put( reqAdmin, adminControl.single.update );
	// taxonomy docs
	app.route( '/admin/taxonomy/:model' ).get( reqAdmin, adminControl.collection.taxonomy );

	/* ---  APP PARAMS   --- */
	app.param( 'model', function (req, res, next, model) {
		var Model = models[model];
		if (Model === undefined) {
			console.log( 'Error: undefined model' );
			return res.sendStatus(404);
		}
		req.Model = Model;
		req.modelName = model;
		return next();
	});

	wtDone();
};
