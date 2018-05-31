/** ****************************************************************************************************
 * @file: deleteItem.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( '../src/Database' );

module.exports = ( req, res ) => {
	return Promise.resolve( {
		collection: req.params.collection,
		id: req.params.id || req.body.id,
		data: req.body
	} )
		.then( ( { collection, id, data } ) => {
			if( collection && data ) {
				if( Database.hasCollection( collection ) ) {
					if( Database.deleteItem( collection, id ) ) {
						return new Response( 200, `Item "${ id }" deleted` );
					} else {
						return new Response( 404, `Item "${ id }" not found` );
					}
				} else {
					return new Response( 404, `Collection "${ collection }" not found` );
				}
			} else {
				return new Response( 400, 'Argument Error - must specify collection name and item id' );
			}
		} )
		.then( d => res.respond( d ) )
		.catch( e => res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) ) );
};
