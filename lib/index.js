/** ****************************************************************************************************
 * @file: index.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( '../src/Database' ),
	Item     = require( '../src/Item' );

module.exports = ( req, res ) => {
	console.log( req.body );
	return Promise.resolve( 'ok' )
		.then( d => res.respond( d ) )
		.catch( e => res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) ) );
};
