/** ****************************************************************************************************
 * @file: getCollection.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	Response          = require( 'http-response-class' ),
	{ getCollection } = require( '../src/actions' );

module.exports = ( req, res ) => {
	return Promise.resolve( req.params.collection )
		.then( collection => getCollection( collection ) )
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
