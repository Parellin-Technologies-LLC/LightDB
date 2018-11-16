/** ****************************************************************************************************
 * @file: LightDBAPI.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	request       = require( 'request' ),
	{ isSuccess } = require( 'http-response-class' );

/**
 * LightDBAPI
 */
class LightDBAPI
{
	/**
	 * constructor
	 * @param {string} [protocol=http] - LightDB protocol
	 * @param {string} [host=127.0.0.1] - LightDB host
	 * @param {number} [port=23000] - LightDB port
	 */
	constructor( protocol = 'http', host = '127.0.0.1', port = 23000 )
	{
		this.protocol = protocol;
		this.host     = host;
		this.port     = port;
		this.basename = `${ this.protocol }://${ this.host }:${ this.port }`;
	}

	request( opts )
	{
		return new Promise(
			( res, rej ) => {
				if( opts.uri ) {
					if( !opts.uri.startsWith( this.basename ) ) {
						opts.uri = `${ this.basename }${ opts.uri }`;
					}
				}

				opts.json = opts.json || true;

				request( opts,
					( e, status, data ) => e ?
						rej( e ) :
						isSuccess( status.statusCode ) ?
							res( data ) :
							rej( data )
				);
			}
		);
	}

	/**
	 * ping
	 * @description
	 * ALL 127.0.0.1:23000/ping
	 * status check
	 * @return {string} - returns "pong"
	 */
	ping()
	{
		return this.request( { uri: '/ping' } );
	}

	/**
	 * version
	 * @description
	 * ALL 127.0.0.1:23000/version
	 * returns version of LightDB
	 * @return {string} - returns "v0.0.1"
	 */
	version()
	{
		return this.request( { uri: '/version' } );
	}

	/**
	 * kill
	 * @description
	 * GET 127.0.0.1:23000/kill
	 * kills LightDB server
	 * @return {string} - returns "v0.0.1"
	 */
	kill()
	{
		return this.request( { uri: '/kill' } );
	}

	/**
	 * databaseInfo
	 * @description
	 * GET 127.0.0.1:23000/
	 * returns array of database information
	 * @return {Object[]} - returns array of collection data
	 */
	databaseInfo()
	{
		return this.request( { uri: '/' } );
	}

	/**
	 * toJSON
	 * @description
	 * GET 127.0.0.1:23000/json
	 * returns array of database information, collection information, collection items, and all data
	 * @return {Object[]} - returns entire serializable JSON dump of the LightDB
	 */
	toJSON()
	{
		return this.request( { uri: '/json' } );
	}

	/**
	 * task
	 * @description
	 * POST 127.0.0.1:23000/task
	 * @param {Object} data - operation specifications
	 * @param {string} data.action - action to perform (ie: createItem)
	 * @param {string} [data.collection] - specify which collection to perform the action
	 * @param {string} [data.parameters] - specify filters, sorting patters, etc.
	 * @param {string} [data.data] - specify the data to pass in the action
	 * @return {*} - returns depend on the request
	 */
	task( data )
	{
		return this.request( {
			method: 'POST',
			uri: '/task',
			json: data
		} );
	}
}

module.exports = LightDBAPI;
