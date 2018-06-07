/** ****************************************************************************************************
 * @file: deleteItem.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response       = require( 'http-response-class' ),
	{ deleteItem } = require( '../src/actions' );

module.exports = ( req, res ) => {
	return Promise.resolve( {
		collection: req.params.collection,
		_id: req.params._id || req.body._id
	} )
		.then( ( { collection, _id } ) => deleteItem( collection, _id ) )
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
