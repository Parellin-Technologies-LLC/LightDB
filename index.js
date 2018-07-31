/** ****************************************************************************************************
 * File: index.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';


const
	gonfig = require( 'gonfig' );

gonfig
	.setLogLevel( gonfig.LEVEL.VERBOSE )
	.setEnvironment( gonfig.ENV.DEBUG )
	.load( 'server', 'config/server.json' )
	.load( 'api', 'config/api.js' )
	.refresh();

( async () => {
	if( gonfig.get( 'pm_id' ) ) {
		// await require( './init' )();
	}
	
	await require( './init' )();
	
	require( './server' )
		.initialize()
		.start();
} )();
