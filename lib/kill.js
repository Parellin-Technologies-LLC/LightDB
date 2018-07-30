/** ****************************************************************************************************
 * File: kill.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	server   = require( '../server' );

module.exports = ( req, res ) => {
	return Promise.resolve( 'server terminated' )
		.then( d => res.respond( new Response( 200, d ) ) )
		.then( () => server.shutdown( 0 ) )
		.catch(
			e => e instanceof Response ?
				res.respond( e ) :
				res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) )
		);
};
