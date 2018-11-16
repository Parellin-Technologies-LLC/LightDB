/** ****************************************************************************************************
 * @file: task.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 07-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	{ Task, validate } = require( '../lib/validate' ),
	Response           = require( 'http-response-class' ),
	IPCClient          = require( '../lib/IPCClient' ),
	actions            = require( '../lib/actions' );

module.exports = ( req, res ) => {
	return validate( Task, req.body )
		.then( ( { action, collection, parameters, data } ) => {
			if( !actions.hasOwnProperty( action ) ) {
				return new Response( 417, {
					message: `Invalid action "${ action }"`,
					availableActions: Object.keys( actions )
				} );
			} else {
				return IPCClient.emit( { action, collection, data, parameters } );
			}
		} )
		.then( d => ( console.log( d ), d ) )
		.then( d => res.respond( d ) )
		.catch(
			e => e instanceof Response ?
				res.respond( e ) :
				res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) )
		);
};
