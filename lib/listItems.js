/** ****************************************************************************************************
 * @file: listItems.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( '../src/Database' );

module.exports = ( req, res ) => {
	return Promise.resolve( req.params.collection )
		.then( collection => Database.listItems( collection ) )
		.then( d => res.respond( new Response( 200, [ ...d ] ) ) )
		.catch( e => res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) ) );
};
