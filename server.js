/** ****************************************************************************************************
 * File: server.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig      = require( 'gonfig' ),
	http        = require( 'http' ),
	express     = require( 'express' ),
	bodyParser  = require( 'body-parser' ),
	{ resolve } = require( 'path' ),
	debug       = require( './debug' );

let isClosed = false;

class LightDB
{
	constructor()
	{

	}

	hookRoute( item )
	{
		item.exec = require( resolve( item.exec ) );

		this.express[ item.method.toLowerCase() ](
			item.route,
			( req, res ) => res.locals ?
				item.exec( req, res.locals ) :
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

		gonfig.set( 'api', gonfig.get( 'api' ).map( item => this.hookRoute( item ) ) );

		this.express.use( require( './src/captureErrors' )() );
	}

	initialize()
	{
		this.expressInitialize();

		process
		// .on( 'uncaughtException', err => debug( gonfig.getErrorReport( err ) ) )
		// .on( 'unhandledRejection', err => debug( gonfig.getErrorReport( err ) ) )
			.on( 'uncaughtException', err => debug( err ) )
			.on( 'unhandledRejection', err => debug( err ) )
			.on( 'SIGINT', () => {
				debug( 'Received SIGINT, graceful shutdown...' );
				this.shutdown( 0 );
			} )
			.on( 'exit', code => {
				debug( `Received exit with code ${ code }, graceful shutdown...` );
				this.shutdown( code );
			} );

		return this;
	}

	start()
	{
		return new Promise(
			res => {
				this.server = http.createServer( this.express );

				this.server.listen(
					gonfig.get( 'server' ).port,
					gonfig.get( 'server' ).host,
					() => {
						debug(
							`${ gonfig.get( 'name' ) } ` +
							`v${ gonfig.get( 'version' ) } ` +
							`running on ${ gonfig.get( 'lanip' ) }:${ gonfig.get( 'server' ).port }`
						);

						res( this );
					}
				);
			}
		);
	}

	shutdown( code = 0 )
	{
		if( this.server ) {
			this.server.close();
		}

		if( isClosed ) {
			debug( 'Shutdown after SIGINT, forced shutdown...' );
			process.exit( 0 );
		}

		isClosed = true;

		debug( 'server exiting with code:', code );
		process.exit( code );
	}
}

module.exports = new LightDB();
