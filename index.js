'use strict';

var Hardwire = require('hardwire'),
	express = require('express'),
	mongoose = require('mongoose'),
	baseConfig = require('./stuff/base-config.json'),
	path = require('path'),
	SingleDoc = require('./core/utilities/SingleDoc.js');

var processCollection = function (schema, settings) {
	if (settings._taxoInfo) {
		schema
		.virtual( '_taxoInfo' )
		.get( settings._taxoInfo );
	}
	return mongoose.model( settings.modelName, schema, settings.collection );
};

var processSingle = function (val, settings) {
	return new SingleDoc( settings.modelName, val );
};


var Jetkit = function (folder) {
	new Hardwire({
		engine: 'jetkit',
		folder: folder,
		output: 'output/build',
		buildFolders: ['public', 'views'],
		config: baseConfig,
		validator: {engine: 'jetkit'},
		envProcessing: {MONGODB_URI: 'mongodb.uri'},
		afterConfig: function (next) {
			this.config.rootPath = this.folder;
			this.config.tempFolder = path.resolve( this.folder, this.config.tempFolder );
			next();
		},
		beforeLoad: function (next) {
			this.tree
			.add( 'express', express )
			.add( 'app', express( ))
			.add( 'mongoose', mongoose )
			.then( next );
		},
		load: function (blockPath, next) {
			this.tree
			.folder( blockPath + '/lib', {
				hidden: true
			})
			.folder( blockPath + '/models', {
				group : 'models',
				suffix: 'Model'
			})
			.folder( blockPath + '/models/collections', {
				group : 'models',
				suffix: 'Model',
				processing: processCollection
			})
			.folder( blockPath + '/models/singles', {
				group : 'models',
				suffix: 'Model',
				processing: processSingle
			})
			.folder( blockPath + '/controllers', {
				group : 'control',
				suffix: 'Control'
			})
			.folder( blockPath + '/services', {
				group : 'services',
				suffix: 'Srv'
			})
			.folder( blockPath + '/utilities', {
				group : 'utilities',
				suffix: 'Util'
			})
			.folder( blockPath + '/buckets', {
				group : 'buckets',
				suffix: 'Bucket'
			})
			.folder( blockPath + '/routes', {
				group: 'router',
				suffix: 'Router'
			})
			.then( function () {
				next();
			});
		},
		afterAll: function (err) {
			if (err) { throw err;}
			var app = this.tree.get( 'app' ),
				http;
			if (!this.config.ssl) {
				http = require('http');
				http.createServer( app ).listen( this.config.port );
			} else {
				http = require('https');
				http.createServer( this.config.sslCert, app ).listen( this.config.port );
			}
			console.log( 'listening port ' + this.config.port );
		}

	}, true );
};

module.exports = Jetkit;
