'use strict';

var path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	errorHandler = require('errorhandler'),
	compression = require('compression'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	timeOut = require('./local/timeout.js')(),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	multer  = require('multer');

// Middleware

exports.wiretree = function (app, express, config, UserModel, wtDone) {

	var User = UserModel,
		SessionStore, sessionStore, sessionConfig;

	var rootPath = config.rootPath;

	app.set('showStackError', true);

	app.use( flash() );
	if (config.favicon) {
		app.use( favicon( config.favicon ) );
	}

	if (process.env.NODE_ENV !== 'production') {
		app.use( logger( 'dev' ));
	}

	// Error handler
	if (process.env.NODE_ENV !== 'production') {
		app.use(errorHandler());
	}

	// should be placed before express.static
	app.use( compression({
		filter: function (req, res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// set views folder
	app.set( 'views', path.resolve( config.rootPath, 'output/build/views' ));
	//app.use( '/_uploads', express.static( path.resolve( config.rootPath, 'uploads' )));
	app.use(express.static( path.resolve( config.rootPath, 'output/build/public')));

	// add public folders from config
	var folder;
	for (folder in config.publicFolders) {
		app.use( folder, express.static( rootPath + config.publicFolders[folder] ));
	}

	app.use( timeOut );       // request timeouts

	// cookieParser should be above session
	app.use( cookieParser() );

	// bodyParser should be above methodOverride
	// parse application/x-www-form-urlencoded
	app.use( bodyParser.urlencoded({ extended: false }));
	// parse application/json
	app.use( bodyParser.json() );
	//app.use( multer( ));
	app.use( methodOverride( ));

	/*
	 * Session storage  ----------------------------------------
	 */
	SessionStore = require( 'connect-mongo' )({ session: session });
	sessionStore = new SessionStore({
		url: config.mongodb.uri,
		collection : 'sessions'
	});

	sessionConfig = {
		secret: config.session.secret || 'yoursecret',
		key: config.session.key || 'yoursessionkey',
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: 365 * 24 * 3600 * 1000, // One year for example
		},
		store: sessionStore,
		resave: true,
		saveUninitialized: true
	};
	app.use( session( sessionConfig ));

	// use passport session
	app.use( passport.initialize( ));
	app.use( passport.session( ));


/*
	// Handle errors thrown from middleware/routes
	app.use(errorMiddleware);
	// adds CSRF support
	if (process.env.NODE_ENV !== 'test') {
		app.use( express.csrf());
	}

	// This could be moved to view-helpers :-)
	app.use(function(req, res, next){
		res.locals.csrf_token = req.session._csrf;
		next();
	});
*/

	// enable global url
	app.use( function (req, res, next) {
		req.globalUrl = config.globalUrl;
		next();
	});

	// pasamos roles por req.session para acceder a ellos desde las vistas
	app.use( function (req, res, next) {
		req.admin = false;
		if ( req.isAuthenticated() ) {
			return User.find({ _id: req.session.passport.user }, function (err, data) {
				if (err) { return next(err);}
				req.session.profile = data[0];
				next();
			});
		}
		next();
	});

	// expose req in locals
	app.use( function (req, res, next) {
		res.locals.req = req;
		next();
	});

	wtDone();
};
