'use strict';

var deepExt = function(ori, desti) {
	var key, val;
	for (key in ori) {
		val = ori[key];
		if ((val === null) || (typeof val !== 'object')) {
			desti[key] = val;
		} else {
			if (!desti[key]) {
				desti[key] = {};
			}
			deepExt(desti[key], val);
		}
	}
	return desti;
};

var limpia = function(query) {
	var prop, val;
	for (prop in query) {
		val = query[prop];
		if (val === '') {
			delete query[prop];
		}
	}
	return query;
};

exports.wiretree = function (app, models, crudsControl, populateUtil) {
	var cruds = crudsControl;
	var popu = populateUtil;
	return {
		index: function (req, res) {
			return res.render('admin/index', {
				title: 'Dashboard',
				req: req
			});
		},

		/*
		 * APP DOCS    ---------------------------------------------------------------
		 */
		collection: {

			search: function (req, res, next) {
				var modelName = req.Model.modelName,
					po = popu( modelName, 'search' );

				cruds.search( modelName, req.query, {population: po}, function (err, data) {
					if (err) { return next( err ); }

					res.render( 'admin/collection/' + modelName + '/list', {
						title: modelName + 's',
						data: data || []
					});
				});
			},

			create: function (req, res, next) {
				cruds.create( req.Model.modelName, req.body, function (err, data) {
					if (err) {
						console.log( err );
						return res.json({
							ok: false
						});
					}
					res.json({
						ok: true,
						id: data.id,
						model: req.Model.modelName,
						modelType: 'collection'
					});
				});
			},

			read: function (req, res) {
				var modelName = req.Model.modelName;
				var po = popu( modelName, 'read' );
				cruds.read( modelName, req.params.id, {population: po}, function (err, data) {
					if (err) {
						console.log( err );
						return res.sendStatus( 500 );
					}
					if (data === null) {
						return res.sendStatus( 404 );
					}
					res.render( 'admin/collection/' + modelName + '/show', {
						title: 'Doc : ' + data.id,
						data: data
					});
				});
			},

			update: function (req, res, next) {

				cruds.update( req.params.id, req.Model.modelName, req.body, function (err, data) {
					if (err) {
						console.log( err );
						return res.json({
							ok: false
						});
					}
					res.json({
						ok: true,
						id: data.id,
						model: req.Model.modelName,
						modelType: 'collection'
					});
				});
			},


			destroy: function (req, res, next) {
				var modelName = req.Model.modelName;
				cruds.destroy( req.params.id, modelName, function (err, data) {
					if (err) {
						return next(err);
					}
					if (data === null) {
						return res.json({ res: false });
					}
					res.json({
						res: true
					});
				});
			},

			new: function (req, res, next) {
				var modelName = req.Model.modelName;
				return res.render('admin/collection/' + modelName + '/new', {
					title: 'Crear ' + modelName,
					data: req.body
				});
			},

			edit: function (req, res) {
				var modelName = req.Model.modelName;
				var po = popu( modelName, 'edit' );
				cruds.read( modelName, req.params.id, {population: po}, function (err, data) {
					if (err) {
						console.log( err );
						return res.sendStatus( 500 );
					}
					if (data === null) {
						return res.sendStatus( 404 );
					}
					res.render('admin/collection/' + modelName + '/edit', {
						title: 'Edit ' + modelName + ' ' + req.params.id,
						data: data
					});
				});
			},

			taxonomy: function (req, res, next) {
				cruds.search( req.modelName, {}, {}, function (err, data) {
					if (err) { return next( err );}
					res.json({
						ok: true,
						data: data
					});
				});
			}
		},
		/*
		 * KEYVAL DOCS    ---------------------------------------------------------------
		 */
		single: {
			edit: function (req, res) {
				var model = models[ req.Model.modelName ];
				model.read( function (err, data) {
					if (err) {
						console.log( err );
						return res.sendStatus( 500 );
					}
					res.render( 'admin/single/' + model.key, {
						title: 'Edit ' + model.key,
						data: data
					});
				});
			},

			update: function (req, res) {
				var model = models[ req.Model.modelName ];
				model.update( req.body, function (err, data) {
					if (err) {
						console.log( err );
						return res.json({
							ok: false
						});
					}
					res.json({
						ok: true,
						model: model.key,
						modelType: 'single'
					});
				});
			}
		}
	};
};

