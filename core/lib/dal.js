exports.wiretree = function (mongoose, config, wtDone) {
	console.log( 'connecting to database...' );
	//set up mongoose database connection
	if(!mongoose.connection.readyState){
		mongoose.connect( config.mongodb.uri, function (err) {
			if(err) {
				var msg = 'Failed to connect to mongodb instance at ' + config.mongodb.uri + '. Please confirm database instance is running.';
				throw new Error(msg);
			}
			console.log( 'MongoDB connection ok' );
			wtDone();
		});
	} else {
		console.log('no mongoose connection readyState');
	}
}