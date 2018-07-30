/** ****************************************************************************************************
 * File: config.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const { resolve } = require( 'path' );

module.exports = [
	{
		route: '/',
		method: 'GET',
		exec: resolve( './lib/index' )
	},
	{
		route: '/',
		method: 'POST',
		exec: resolve( './lib/task' )
	},
	{
		route: '/docs',
		method: 'ALL',
		exec: resolve( './lib/docs' )
	},
	{
		route: '/kill',
		method: 'ALL',
		exec: resolve( './lib/kill' )
	},
	{
		route: '/ping',
		method: 'ALL',
		exec: resolve( './lib/ping' )
	},
	{
		route: '/json',
		method: 'GET',
		exec: resolve( './lib/json' )
	},
	{
		route: '/ui',
		method: 'GET',
		exec: resolve( './lib/ui' )
	},
	{
		route: '/version',
		method: 'ALL',
		exec: resolve( './lib/version' )
	},
	{
		route: '*',
		method: 'ALL',
		exec: resolve( './lib/methodNotAllowed' )
	}
];
