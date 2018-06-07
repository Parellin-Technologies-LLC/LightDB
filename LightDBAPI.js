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
	 * listCollections
	 * @description
	 * GET 127.0.0.1:23000/collections
	 * returns array of collection names
	 * @return {string[]} - returns list of collection names
	 */
	listCollections()
	{
		return this.request( { uri: '/collections' } );
	}

	/**
	 * getCollection
	 * @description
	 * GET 127.0.0.1:23000/:collection
	 * returns collection data
	 * @param {string} _id - collection identifier
	 * @return {Object} - returns collection data
	 */
	getCollection( _id )
	{
		return this.request( { uri: `/${ _id }` } );
	}

	/**
	 * createCollection
	 * @description
	 * POST 127.0.0.1:23000/:collection
	 * returns new collection data
	 * @param {string} _id - collection identifier
	 * @param {string} metadata - collection metadata
	 * @return {Object} - returns collection data
	 */
	createCollection( _id, metadata )
	{
		return this.request( {
			method: 'POST',
			uri: `/${ _id }`,
			json: metadata
		} );
	}

	/**
	 * updateCollection
	 * @description
	 * PUT 127.0.0.1:23000/:collection
	 * returns updated collection data
	 * @param {string} _id - collection identifier
	 * @param {string} metadata - collection metadata
	 * @return {Object} - returns collection data
	 */
	updateCollection( _id, metadata )
	{
		return this.request( {
			method: 'PUT',
			uri: `/${ _id }`,
			json: metadata
		} );
	}

	/**
	 * deleteCollection
	 * @description
	 * DELETE 127.0.0.1:23000/:collection
	 * returns nothing
	 * @param {string} _id - collection identifier
	 * @return {Object} - returns {}
	 */
	deleteCollection( _id )
	{
		return this.request( {
			method: 'DELETE',
			uri: `/${ _id }`
		} );
	}

	/**
	 * createItem
	 * @description
	 * POST 127.0.0.1:23000/:collection/:_id
	 * returns item data
	 * @param {string} collection - collection identifier
	 * @param {string} _id - item identifier
	 * @param {*} data - item data
	 * @return {Object} - returns new item information
	 */
	createItem( collection, _id = 'item', data )
	{
		return this.request( {
			method: 'POST',
			uri: `/${ collection }/${ _id }`,
			json: data
		} );
	}

	/**
	 * getItem
	 * @description
	 * GET 127.0.0.1:23000/:collection/:_id
	 * returns item data
	 * @param {string} collection - collection identifier
	 * @param {string} _id - item identifier (specify nothing to return all items)
	 * @return {Object} - returns item
	 */
	getItem( collection, _id = 'items' )
	{
		return this.request( { uri: `/${ collection }/${ _id }` } );
	}

	/**
	 * getItems
	 * @description
	 * GET 127.0.0.1:23000/:collection/items
	 * returns all items in collection
	 * @param {string} collection - collection identifier
	 * @return {Object} - returns items in collection
	 */
	getItems( collection )
	{
		return this.getItem( collection );
	}

	/**
	 * updateItem
	 * @description
	 * PUT 127.0.0.1:23000/:collection/:_id
	 * returns updated item data
	 * @param {string} collection - collection identifier
	 * @param {string} _id - item identifier
	 * @param {*} data - item data
	 * @return {Object} - returns new item information
	 */
	updateItem( collection, _id, data )
	{
		return this.request( {
			method: 'PUT',
			uri: `/${ collection }/${ _id }`,
			json: data
		} );
	}

	/**
	 * deleteItem
	 * @description
	 * DELETE 127.0.0.1:23000/:collection/:_id
	 * returns nothing
	 * @param {string} collection - collection identifier
	 * @param {string} _id - item identifier
	 * @return {Object} - returns {}
	 */
	deleteItem( collection, _id )
	{
		return this.request( {
			method: 'DELETE',
			uri: `/${ collection }/${ _id }`
		} );
	}
}

module.exports = LightDBAPI;

