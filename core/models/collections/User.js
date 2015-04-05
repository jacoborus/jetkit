'use strict';
var mongoose = require('mongoose');


var crypto = require('crypto'),
	authTypes = ['local'];

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		'default': '',
		unique: true
	},
	username: {
		type: String,
		unique: true
	},
	since: {
		type: Date,
		required: true,
		'default': new Date()
	},
	provider: {
		type: String,
		'default': ''
	},
	hashedPassword: {
		type: String,
		required: true,
		'default': ''
	},
	rol: {
		type: String,
		required: true,
		'default': 'registered'
	},
	salt: {
		type: String,
		'default': ''
	},
	authToken: {
		type: String,
		'default': ''
	},
	ident: {
		type: String
	},
	identOk: {
		type: Boolean
	},
	recoverHash: {
		type: String
	},
	lastVisit: {
		type: Date,
		required: true,
		'default': Date.now
	},
	active: {
		type: Boolean
	}
});

/*
	Virtuals ---------------------------------------------------
 */
UserSchema.virtual( 'password' )
.set( function (password) {
	this.salt = this.makeSalt();
	this.recoverHash = undefined;
	this.hashedPassword = this.encryptPassword( password );
	return this.hashedPassword;
});


/*
	Validations -----------------------------------------------------------------
 */
var validatePresenceOf = function (value) {
	return value && value.length;
};

UserSchema.path('email').validate( function (email) {
	if (authTypes.indexOf(this.provider) !== -1) {
		return true;
	}
	return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate( function (email, fn) {
	var User;
	User = mongoose.model('User');
	if (this.isNew || this.isModified('email')) {
		return User.find({
			email: email
		}).exec(function(err, users) {
			return fn(err || users.length === 0);
		});
	} else {
		return fn(true);
	}
}, 'Email already exists');

UserSchema.path('hashedPassword').validate( function (hashedPassword) {
	if (authTypes.indexOf(this.provider) !== -1) {
		return true;
	}
	return hashedPassword.length;
}, 'Password cannot be blank');

/*
	Pre-save hooks --------------------------------------------------------------------------
 */

UserSchema.pre( 'save', function (next) {
	if (!this.isNew) {
		return next();
	}
	this.provider = 'local';
	if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
		return next( new Error( 'Invalid password' ));
	} else {
		return next();
	}
});

/*
	Methods -----------------------------------------------
 */
UserSchema.methods = {

	/*
			Authenticate - check if the passwords are the same
			@param {String} plainText
			@return {Boolean}
			@api public
	 */
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashedPassword;
	},

	/*
			Make salt
			@return {String}
			@api public
	 */
	makeSalt: function () {
		return Math.round(new Date().valueOf() * Math.random()) + '';
	},

	/*
			Encrypt password
			@param {String} password
			@return {String}
			@api public
	 */
	encryptPassword: function (password) {
		var encrypred, err;
		if (!password) {
			return '';
		}
		encrypred = void 0;
		try {
			encrypred = crypto.createHmac( 'sha1', this.salt ).update( password ).digest('hex');
			return encrypred;
		} catch (_error) {
			err = _error;
			return '';
		}
	}
};

module.exports = {
	wiretree : function () {
		return UserSchema;
	},
	settings : {
		modelName: 'User'
	}
}
