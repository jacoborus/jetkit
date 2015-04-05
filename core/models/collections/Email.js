'use strict';

var mailer = require('curlymail');

exports.wiretree = function (config, mongoose) {

	var EmailSchema = new mongoose.Schema({
		account: {
			type: String,
			required: true
		},
		user: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		host: String,
		port: Number,
		ssl: Boolean,
		tls: Boolean,
		timeout: Number,
		domain: String
	});

	EmailSchema.post( 'save', function (doc) {
		mailer.addAccount( doc.account, doc );
	});

	return EmailSchema;
};

exports.settings = {
	modelName: 'Email'
};
