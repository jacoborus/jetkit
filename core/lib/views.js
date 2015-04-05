'use strict';

exports.wiretree = function (app, config, wtDone) {

    //set up view engine
    app.set( 'view engine', 'jade' );

    // Static locals
    app.locals.pkg = config.seo;
    wtDone();
};