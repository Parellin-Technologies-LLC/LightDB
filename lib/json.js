/** ****************************************************************************************************
 * @file: json.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jul-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( '../src/Database' );

module.exports = ( req, res ) => {
	return Promise.resolve( Database )
		.then( d => res.respond( d ) )
		.catch(
			e => {
				if( e instanceof Response ) {
					res.respond( e );
				} else {
					res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) );
				}
			}
		);
};
