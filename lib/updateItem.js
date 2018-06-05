/** ****************************************************************************************************
 * @file: updateItem.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( '../src/Database' );

module.exports = ( req, res ) => {
	return Promise.resolve( {
		collection: req.params.collection,
		id: req.params._id === 'item' ? req.body._id : req.params._id,
		data: req.body
	} )
		.then( ( { collection, id, data } ) => {
			if( collection && data ) {
				if( Database.hasCollection( collection ) ) {
					const db = Database.getCollection( collection );

					if( db.hasItem( id ) ) {
						console.log( collection, id, data );
						db.updateItem( id, data );
						return new Response( 202, db.updateItem( id, data ) );
					} else {
						return new Response( 404, `Item "${ id }" not found` );
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
