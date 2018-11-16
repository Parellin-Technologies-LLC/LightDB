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
		exec: resolve( './api/index' )
	},
	{
		route: '/',
		method: 'POST',
		exec: resolve( './api/task' )
	},
	{
		route: '/docs',
		method: 'ALL',
		exec: resolve( './api/docs' )
	},
	{
		route: '/kill',
		method: 'ALL',
		exec: resolve( './api/kill' )
	},
	{
		route: '/ping',
		method: 'ALL',
		exec: resolve( './api/ping' )
	},
	{
		route: '/json',
		method: 'GET',
		exec: resolve( './api/json' )
	},
	{
		route: '/ui',
		method: 'GET',
		exec: resolve( './api/ui' )
	},
	{
		route: '/version',
		method: 'ALL',
		exec: resolve( './api/version' )
	},
	{
		route: '*',
		method: 'ALL',
		exec: resolve( './api/methodNotAllowed' )
	}
];
