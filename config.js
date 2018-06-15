/** ****************************************************************************************************
 * File: config.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	{ version, name } = require( './package.json' ),
	{ resolve }       = require( 'path' );

module.exports = {
	name,
	version,
	cwd: process.cwd(),
	silent: process.env.silent,
	port: process.env.port,
	timeout: 20000,
	maximumURISize: 1600,
	maximumHeaderSize: 4000,
	maximumPayloadSize: 53687091200,
	minimumHTTPVersion: 1.1,
	speedStandard: 0.08,
	api: [
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
	]
};
