/** ****************************************************************************************************
 * File: home.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	{ name } = require( '../package' );

module.exports = ( req, res ) => {
	res
		.status( 200 )
		.set( 'Content-Type', 'application/json' )
		.send( JSON.stringify( name ) );
};
