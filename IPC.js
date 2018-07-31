/** ****************************************************************************************************
 * @file: IPC.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Jul-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' ),
	ipc    = require( 'node-ipc' );

class IPC
{
	constructor()
	{
		this.id = gonfig.get( 'name' );

		this.isConnected = false;

		this.handlers = new Map();

		ipc.connectTo(
			this.id,
			() => ipc.of[ this.id ]
				.on( 'connect', () => this.isConnected = true )
				.on( 'disconnect', () => this.isConnected = false )
				.on( 'message', this.handler.bind( this ) )
		);
	}

	emit( msg )
	{
		let res, rej;
		const p = new Promise(
			( _res, _rej ) => {
				res = _res;
				rej = _rej;
			}
		);

		this.handlers.set( msg.id, [ res, rej ] );

		ipc.of[ this.id ].emit( 'message', msg );

		return p;
	}

	handler( data )
	{
		if( data.error ) {
			this.handlers.get( data.id )[ 1 ]( data );
		} else {
			this.handlers.get( data.id )[ 0 ]( data );
		}

		this.handlers.delete( data.id );
	}
}

module.exports = new IPC();
