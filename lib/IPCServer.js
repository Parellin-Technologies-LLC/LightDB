/** ****************************************************************************************************
 * @file: IPCServer.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 10-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig   = require( 'gonfig' ),
	Response = require( 'http-response-class' ),
	ipc      = require( 'node-ipc' ),
	Database = require( './Database' ),
	actions  = require( './actions' );

class IPCServer
{
	constructor()
	{
		this.id = gonfig.get( 'name' );

		ipc.config.id         = this.id;
		ipc.config.appspace   = 'app.';
		ipc.config.socketRoot = '/tmp/';
		ipc.config.retry      = 1500;
		ipc.config.silent     = true;

		ipc.serve( () => ipc.server.on( 'message', this.handler ) );
	}

	async start()
	{
		await ipc.server.start();

		Database
			.createCollection( '__main__', { description: 'main process database' } );

		Database
			.getCollection( '__main__' )
			.createItem( '__item__', { description: 'main process item' } );
	}

	async stop()
	{
		await ipc.server.stop();
	}

	handler( { id, msg: { action, collection, parameters, data } }, socket )
	{
		let response;
		if( ( collection && !Database.hasCollection( collection ) && action !== 'createCollection' ) ) {
			response = new Response( 404, `Collection "${ collection }" not found` );
		} else {
			response = actions[ action ]( collection, data, parameters );
		}

		ipc.server.emit( socket, 'message', { id, ...response } );
	}
}

module.exports = new IPCServer();
