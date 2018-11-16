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
	.setEnvironment( gonfig.ENV.DEVELOPMENT )
	.load( 'server', 'config/server.json' )
	.load( 'api', 'config/api.js' )
	.refresh();

const
	io          = require( '@pm2/io' ),
	{ resolve } = require( 'path' ),
	http        = require( 'http' ),
	express     = require( 'express' ),
	helmet      = require( 'helmet' ),
	cors        = require( 'cors' ),
	bodyParser  = require( 'body-parser' ),
	packet      = require( './lib/middleware/packet' ),
	debug       = require( './lib/debug' ),
	lanIP       = require( './lib/lanIP' );

process.title = 'lightdb';

io.init( {
	metrics: {
		v8: true
	}
} );

/**
 * LightDB
 * @description
 * Default PM2 Application setup
 * All methods in this class are automatically called by PM2 in the following order:
 * 1. `onStart`
 * 2. `sensors`
 * 3. `actuators`
 * 4. `onStop`
 */
class LightDB extends io.Entrypoint
{
	hookRoute( item )
	{
		item.exec = require( resolve( item.exec ) );

		this.express[ item.method.toLowerCase() ](
			item.route,
			( req, res ) => {
				this.reqMeter.mark();

				return res.locals ?
					item.exec( req, res.locals ) :
					res.status( 500 ).send( 'unknown' );
			}
		);

		return item;
	}

	expressInitialize()
	{
		this.express = express();

		this.express.use( helmet() );
		this.express.use( bodyParser.json() );
		this.express.use( bodyParser.text() );
		this.express.use( cors() );
		this.express.use( packet() );

		gonfig.set( 'api', gonfig.get( 'api' ).map( item => this.hookRoute( item ) ) );

		// capture all unhandled errors that might occur
		this.express.use( require( './lib/middleware/captureErrors' )() );
	}

	initialize()
	{
		debug( 'initialize' );

		this.expressInitialize();

		process
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
	}

	start()
	{
		debug( 'start' );

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
			}
		);
	}

	async onStart( cb )
	{
		console.log( 'onStart' );

		gonfig.set( 'lanip', lanIP );

		if( gonfig.get( 'pm_id' ) === '0' ) {
			this.IPCServer = require( './lib/IPCServer' );
			await this.IPCServer.start();
		} else if( gonfig.get( 'pm_id' ) ) {
			this.IPCClient = require( './lib/IPCClient' );
			await this.IPCClient.connect();
			this.initialize();
			this.start();
		} else {
			this.IPCServer = require( './lib/IPCServer' );
			await this.IPCServer.start();

			this.IPCClient = require( './lib/IPCClient' );
			await this.IPCClient.connect();

			this.initialize();
			this.start();
		}

		cb();
	}

	sensors()
	{
		console.log( 'sensors' );
		this.reqMeter = this.io.meter( 'req/min' );
	}

	actuators()
	{
		console.log( 'actuators' );
		this.io.action( 'getApp', reply => reply( { server: this.server } ) );
		this.io.action( 'getEnv', reply => reply( { env: process.env } ) );
	}

	shutdown( code = 0 )
	{
		if( this.server ) {
			this.server.close();
		}

		// if( isClosed ) {
		// 	debug( 'Shutdown after SIGINT, forced shutdown...' );
		// 	process.exit( 0 );
		// }
		// isClosed = true;

		debug( `server exiting with code: ${ code }` );
		process.exit( code );
	}

	async onStop( err, cb = () => {}, code = 0, signal )
	{
		if( err ) {
			console.error( err );
		}

		if( this.IPCServer ) {
			await this.IPCServer.stop();
		}

		console.log( `App has exited with code ${ code } - ${ signal }` );

		cb();
	}
}

module.exports = new LightDB();
