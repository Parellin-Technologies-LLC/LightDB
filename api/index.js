/** ****************************************************************************************************
 * @file: index.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response  = require( 'http-response-class' ),
	IPCClient = require( '../lib/IPCClient' );

module.exports = ( req, res ) => {
	return IPCClient.emit( { action: 'getDatabaseInformation' } )
		.then( d => res.respond( d ) )
		.catch(
			e => e instanceof Response ?
				res.respond( e ) :
				res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) )
		);
};
