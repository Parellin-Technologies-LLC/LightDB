/** ****************************************************************************************************
 * @file: createItem.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( '../src/Database' ),
	Item     = require( '../src/Item' );

module.exports = ( req, res ) => {
	return Promise.resolve( {
		collection: req.params.collection,
		id: req.params.id || req.body.id,
		data: req.body
	} )
		.then( ( { collection, id, data } ) => {
			if( collection && data ) {
				if( Database.hasCollection( collection ) ) {
					if( Database.hasItem( collection, id ) ) {
						return new Response( 409, `Item "${ id }" already exists` );
					} else {
						const item = new Item( id, data );
						
						const x = Database.createItem( collection, item.id, item );
						console.log( x );
						return new Response( 201, item );
					}
				} else {
					return new Response( 404, `Collection "${ collection }" not found` );
				}
			} else {
				return new Response( 400, 'Argument Error - must specify collection name and item data' );
			}
		} )
		.then( d => res.respond( d ) )
		.catch( e => res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) ) );
};
