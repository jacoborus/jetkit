'use strict';

var mongoose = require('mongoose');

var SingleDocModel = function (key, schema) {
	schema.add({ kvKey: String });
	this.key = key;
	this.modelName = key;
	this.model = mongoose.model( key, schema, 'keyval' );
};

SingleDocModel.prototype.read = function (callback) {
	this.model
	.findOne({ kvKey: this.key })
	.exec( function (err, doc) {
		if (err) { return callback( err );}
		doc = doc || {};
		callback( null, doc );
	});
};

SingleDocModel.prototype.update = function (doc, callback) {
	var self = this;
	this.model
	.findOne({ kvKey: this.key }, function (err, old) {
		if (err) {return callback(err);}
		old = old || new self.model({});
		var i;
		for (i in doc) {
			old[i] = doc[i];
		}
		old.kvKey = self.key;
		old.save( function (err, data) {
			if (err) {
				return callback( err );
			}
			callback( null, data );
		});
	});
};

module.exports = SingleDocModel;
