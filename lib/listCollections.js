/** ****************************************************************************************************
 * File: listCollections.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	Response            = require( 'http-response-class' ),
	{ listCollections } = require( '../src/actions' );

module.exports = ( req, res ) => {
	return Promise.resolve( listCollections() )
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
