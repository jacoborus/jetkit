'use strict';

module.exports.wiretree = function (app, control, wtDone) {
	app.route('/').get( control.main.index );
	wtDone();
};
