/** ****************************************************************************************************
 * File: index.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';


const
	gonfig = require( 'gonfig' ),
	lanIP  = require( './src/lanIP' );

gonfig
	.setLogLevel( gonfig.LEVEL.NONE )
	.setEnvironment( gonfig.ENV.DEVELOPMENT )
	.load( 'server', 'config/server.json' )
	.load( 'api', 'config/api.js' )
	.refresh();

gonfig.set( 'lanip', lanIP );

process.title = 'lightdb';

( async () => {
	if( gonfig.get( 'pm_id' ) === '0' ) {
		return await require( './src/IPCServer' ).start();
	} else if( gonfig.get( 'pm_id' ) ) {
		await require( './src/IPCClient' );

		return require( './server' )
			.initialize()
			.start();
	} else {
		await require( './src/IPCServer' ).start();
		await require( './src/IPCClient' );
		return require( './server' )
			.initialize()
			.start();
	}

} )();
