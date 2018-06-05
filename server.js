/** ****************************************************************************************************
 * File: server.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	http        = require( 'http' ),
	express     = require( 'express' ),
	bodyParser  = require( 'body-parser' ),
	{ resolve } = require( 'path' ),
	lanIP       = require( './src/lanIP' ),
	logging     = process.env.silent === 'false';

let isClosed = false;

class LightDB
{
	constructor( config )
	{
		process.config = config;

		const Database = require( './src/Database' );

		Database
			.createCollection( '__main__', { description: 'main process database' } );

		Database
			.getCollection( '__main__' )
			.createItem( '__item__', { description: 'main process item' } );
	}

	hookRoute( item )
	{
		item.exec = require( resolve( item.exec ) );

		this.express[ item.method.toLowerCase() ](
			item.route,
			( req, res ) => res ?
				item.exec( req, res ) :
				res.status( 500 ).send( 'unknown' )
		);

		return item;
	}

	expressInitialize()
	{
		this.express = express();

		this.express.disable( 'x-powered-by' );
		this.express.use( bodyParser.json() );
		this.express.use( bodyParser.text() );
		this.express.use( require( './src/inspection' )() );

		process.config.api = process.config.api
			.map( item => this.hookRoute( item ) );
	}

	initialize()
	{
		this.expressInitialize();

		return new Promise(
			res => {
				process
					.on( 'SIGINT', () => {
						if( logging ) {
							console.log( 'Received SIGINT, graceful shutdown...' );
						}

						this.shutdown( 0 );
					} )
					.on( 'uncaughtException', err => {
						if( logging ) {
							console.log( 'global status: ' + ( err.status || 'no status' ) + '\n' + JSON.stringify( err.message ) + '\n' + JSON.stringify( err.stack ) );
							console.log( err );
						}
					} )
					.on( 'unhandledRejection', err => {
						if( logging ) {
							console.log( err );
						}
					} )
					.on( 'exit', code => {
						if( logging ) {
							console.log( `Received exit with code ${ code }, graceful shutdown...` );
						}

						this.shutdown( code );
					} );

				res( this );
			}
		);
	}

	start()
	{
		return new Promise(
			res => {
				this.server = http.createServer( this.express );

				this.server.listen( process.config.port, () => {
					if( logging ) {
						console.log(
							`${ process.config.name } ` +
							`v${ process.config.version } ` +
							`running on ${ lanIP }:${ process.config.port }`
						);
					}

					res( this );
				} );
			}
		);
	}

	shutdown( code )
	{
		if( !logging ) {
			this.server.close();
			return;
		}

		code = code || 0;

		if( this.server ) {
			this.server.close();
		}

		if( isClosed ) {
			if( logging ) {
				console.log( 'Shutdown after SIGINT, forced shutdown...' );
			}
			process.exit( 0 );
		}

		isClosed = true;

		if( logging ) {
			console.log( 'server exiting with code:', code );
		}

		process.exit( code );
	}
}

module.exports = ( config = require( './config' ) ) => new LightDB( config );
