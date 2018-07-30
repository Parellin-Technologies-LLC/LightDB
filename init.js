/** ****************************************************************************************************
 * File: init.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Jul-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' ),
	lanIP  = require( './src/lanIP' );

module.exports = async () => {
	return await gonfig.set( 'lanip', lanIP );
};
