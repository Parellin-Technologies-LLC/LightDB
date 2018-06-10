/** ****************************************************************************************************
 * @file: task.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 07-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	{ Task, validate } = require( '../src/validate' ),
	Response           = require( 'http-response-class' ),
	Database           = require( '../src/Database' ),
	actions            = require( '../src/actions' );

module.exports = ( req, res ) => {
	return validate( Task, req.body )
		.then( ( { action, collection, parameters, data } ) => {
			if( !actions.hasOwnProperty( action ) ) {
				return new Response( 417, {
					message: `Invalid action "${ action }"`,
					availableActions: Object.keys( actions )
				} );
			} else if( ( collection && !Database.hasCollection( collection ) && action !== 'createCollection' ) ) {
				return new Response( 404, `Collection "${ collection }" not found` );
			} else {
				return actions[ action ]( collection, data, parameters );
			}
		} )
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
