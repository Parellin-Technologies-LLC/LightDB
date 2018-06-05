/** ****************************************************************************************************
 * @file: createCollection.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( '../src/Database' );

module.exports = ( req, res ) => {
	return Promise.resolve( req.params.collection )
		.then( collection => {
			if( collection ) {
				if( Database.hasCollection( collection ) ) {
					return new Response( 409, `Collection "${ collection }" already exists` );
				} else {
					const db = Database.createCollection( collection, req.body || {} ).get( collection );
					return new Response( 200, db );
				}
			} else {
				return new Response( 400, 'Argument Error - must specify collection name' );
			}
		} )
		.then( d => res.respond( d ) )
		.catch( e => res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) ) );
};
