/*
Create a new bulk admin user in DDBB:
email: admin@admin.com
password: admin
*/
'use strict';

var fs = require('fs'),
	path = require('path'),
	crypto = require('crypto'),
	configPath = path.resolve('./app/config/default.json'),
	mongoose = require( 'mongoose' ),
	config;

if (fs.existsSync( configPath )) {
	config = require( configPath );
} else {
	console.log( 'Can\'t find donfiguration file' );
	process.exit(1);
}

var Schema = mongoose.Schema;

var makeSalt = function() {
	return Math.round(new Date().valueOf() * Math.random()) + '';
};

var encryptPassword = function(password, salt) {
	var encrypred, err;
	if (!password) {
		return '';
	}
	encrypred = void 0;
	try {
		encrypred = crypto.createHmac('sha1', salt).update(password).digest('hex');
		return encrypred;
	} catch (_error) {
		err = _error;
		return '';
	}
};

var creadmin = function() {

	/*
		User Schema
	 */
	var User, UserSchema, admin, sal;
	UserSchema = new Schema({
		email: String,
		since: Date,
		provider: String,
		hashedPassword: String,
		password: String,
		rol: String,
		salt: String,
		authToken: String
	});
	User = mongoose.model('User', UserSchema);
	sal = makeSalt();
	admin = new User({
		email: 'admin@admin.com',
		since: new Date(),
		provider: 'local',
		hashedPassword: encryptPassword('admin', sal),
		salt: sal,
		rol: 'admin',
		authToken: String,
		lastVisit: new Date(),
		activo: true
	});
	return admin.save( function(err) {
		if (err) {
			console.log('error' + err);
			process.exit(0);
		}
		console.log('User: admin@admin.com:admin created');
		return process.exit(0);
	});
};

if (mongoose.connection.readyState !== null) {
	mongoose.connect( config.mongodb.uri, function (err) {
		var msg;
		if (err) {
			msg = 'Failed to connect to mongodb instance at ' + config.mongodb.uri + '. Please confirm database instance is running.';
			return msg;
		} else {
			return creadmin();
		}
	});
} else {
	console.log( 'no mongoose connection readyState' );
}
