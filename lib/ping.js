/** ****************************************************************************************************
 * @file: ping.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const Response = require( 'http-response-class' );

const IPC = require( '../IPC' );

module.exports = ( req, res ) => {

	IPC.emit( { id: 'ping' } )
		.then( console.log )
		.catch( console.error );

	console.log( IPC );

	return Promise.resolve( 'pong' )
		.then( d => res.respond( new Response( 200, d ) ) )
		.catch(
			e => e instanceof Response ?
				res.respond( e ) :
				res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) )
		);
};
