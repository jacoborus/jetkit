'use strict';

exports.wiretree = function (RebucketUtil, config) {
	return new RebucketUtil({
		aws: false,
		safenames: true,
		path: config.rootPath + '/uploads'
	});
};
