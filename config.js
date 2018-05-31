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
	silent: process.env.SILENT,
	data: process.env.DATA,
	port: process.env.PORT,
	root: resolve( process.env.DATA ),
	dotfiles: 'allow',
	timeout: 20000,
	maximumURISize: 1600,
	maximumHeaderSize: 4000,
	maximumPayloadSize: 53687091200,
	minimumHTTPVersion: 1.1,
	speedStandard: 0.08,
	api: [
		{
			route: '/',
			method: 'ALL',
			exec: resolve( './lib/home' )
		},
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
			route: '/data*',
			method: 'GET',
			exec: resolve( './lib/getData' )
		},
		{
			route: '/data*',
			method: 'PUT',
			exec: resolve( './lib/upload' )
		},
		{
			route: '/data*',
			method: 'POST',
			exec: resolve( './lib/upload' )
		},
		{
			route: '/data*',
			method: 'DELETE',
			exec: resolve( './lib/deleteData' )
		},
		{
			route: '/form*',
			method: 'GET',
			exec: resolve( './lib/getData' )
		},
		{
			route: '/form*',
			method: 'PUT',
			exec: resolve( './lib/uploadForm' )
		},
		{
			route: '/form*',
			method: 'POST',
			exec: resolve( './lib/uploadForm' )
		},
		{
			route: '/form*',
			method: 'DELETE',
			exec: resolve( './lib/deleteData' )
		},
		{
			route: '*',
			method: 'ALL',
			exec: resolve( './lib/methodNotAllowed' )
		}
	]
};
