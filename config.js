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
			route: '/json',
			method: 'GET',
			exec: resolve( './lib/toJSON' )
		},

		{
			route: '/',
			method: 'GET',
			exec: resolve( './lib/index' )
		},
		{
			route: '/collections',
			method: 'GET',
			exec: resolve( './lib/listCollections' )
		},
		{
			route: '/:collection',
			method: 'GET',
			exec: resolve( './lib/getCollection' )
		},
		{
			route: '/:collection',
			method: 'POST',
			exec: resolve( './lib/createCollection' )
		},
		{
			route: '/:collection',
			method: 'PUT',
			exec: resolve( './lib/updateCollection' )
		},
		{
			route: '/:collection',
			method: 'DELETE',
			exec: resolve( './lib/deleteCollection' )
		},



		{
			route: '/:collection/items',
			method: 'GET',
			exec: resolve( './lib/listItems' )
		},
		{
			route: '/:collection/:id',
			method: 'GET',
			exec: resolve( './lib/getItem' )
		},



		{
			route: '/:collection/item',
			method: 'POST',
			exec: resolve( './lib/createItem' )
		},
		{
			route: '/:collection/:_id',
			method: 'POST',
			exec: resolve( './lib/createItem' )
		},



		{
			route: '/:collection/:_id',
			method: 'PUT',
			exec: resolve( './lib/updateItem' )
		},

		{
			route: '/:collection/:_id',
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
