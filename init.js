/** ****************************************************************************************************
 * File: init.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Jul-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' ),
	lanIP  = require( './src/lanIP' );

const Database = require( './src/Database' );

const ipc = require( 'node-ipc' );

process.title = 'lightdb';

module.exports = async () => {
	await gonfig.set( 'lanip', lanIP );

	ipc.config.id     = gonfig.get( 'name' );
	ipc.config.retry  = 1500;
	ipc.config.silent = true;

	ipc.serve(
		function() {
			ipc.server.on(
				'message',
				function( data, socket ) {
					console.log( 'data', data );
					ipc.server.emit( socket, 'message', data );
				}
			);
		}
	);

	await ipc.server.start();

	require( './IPC' );

	if( process.env.pm_id === '0' ) {
	}

	Database
		.createCollection( '__main__', { description: 'main process database' } );

	Database
		.getCollection( '__main__' )
		.createItem( '__item__', { description: 'main process item' } );
};
