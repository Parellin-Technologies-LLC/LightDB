/** ****************************************************************************************************
 * @file: json.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jul-2018
 *******************************************************************************************************/
'use strict';

const
	Response  = require( 'http-response-class' ),
	IPCClient = require( '../src/IPCClient' );

module.exports = ( req, res ) => {
	return IPCClient.emit( { action: 'getDatabase' } )
		.then( d => res.respond( d ) )
		.catch(
			e => e instanceof Response ?
				res.respond( e ) :
				res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) )
		);
};
