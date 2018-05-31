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
			route: '/ping',
			method: 'ALL',
			exec: resolve( './lib/ping' )
		},
		{
			route: '/version',
			method: 'ALL',
			exec: resolve( './lib/version' )
		},
		{
			route: '/kill',
			method: 'ALL',
			exec: resolve( './lib/kill' )
		},
		{
			route: '/docs',
			method: 'ALL',
			exec: resolve( './lib/docs' )
		},



		{
			route: '/',
			method: 'ALL',
			exec: resolve( './lib/index' )
		},
		
		{
			route: '/db',
			method: 'GET',
			exec: resolve( './lib/listCollections' )
		},
		{
			route: '/db/:collection',
			method: 'GET',
			exec: resolve( './lib/listItems' )
		},
		{
			route: '/db/:collection/:id',
			method: 'GET',
			exec: resolve( './lib/getItem' )
		},



		{
			route: '/db',
			method: 'POST',
			exec: resolve( './lib/createCollection' )
		},
		{
			route: '/db/:collection',
			method: 'POST',
			exec: resolve( './lib/createItem' )
		},
		{
			route: '/db/:collection/:id',
			method: 'POST',
			exec: resolve( './lib/createItem' )
		},
		
		
		{
			route: '/db',
			method: 'DELETE',
			exec: resolve( './lib/deleteCollection' )
		},
		{
			route: '/db/:collection',
			method: 'DELETE',
			exec: resolve( './lib/deleteItem' )
		},
		{
			route: '/db/:collection/:id',
			method: 'DELETE',
			exec: resolve( './lib/deleteItem' )
		},



		{
			route: '*',
			method: 'ALL',
			exec: resolve( './lib/methodNotAllowed' )
		}
	]
};
