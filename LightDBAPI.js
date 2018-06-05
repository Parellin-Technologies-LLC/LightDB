/** ****************************************************************************************************
 * @file: LightDBAPI.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	request       = require( 'request' ),
	{ isSuccess } = require( 'http-response-class' );

class LightDBAPI
{
	constructor( protocol, host, port )
	{
		this.protocol = protocol || 'http';
		this.host     = host || '127.0.0.1';
		this.port     = port || 23000;
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

	ping()
	{
		return this.request( { uri: '/ping' } );
	}

	version()
	{
		return this.request( { uri: '/version' } );
	}

	kill()
	{
		return this.request( { uri: '/kill' } );
	}

	databaseInfo()
	{
		return this.request( { uri: '/' } );
	}

	toJSON()
	{
		return this.request( { uri: '/json' } );
	}

	listCollections()
	{
		return this.request( { uri: '/collections' } );
	}

	getCollection( _id )
	{
		return this.request( { uri: `/${ _id }` } );
	}

	createCollection( _id, metadata )
	{
		return this.request( {
			method: 'POST',
			uri: `/${ _id }`,
			json: metadata
		} );
	}

	updateCollection( _id, metadata )
	{
		return this.request( {
			method: 'PUT',
			uri: `/${ _id }`,
			json: metadata
		} );
	}

	deleteCollection( _id )
	{
		return this.request( {
			method: 'DELETE',
			uri: `/${ _id }`
		} );
	}

	createItem( collection, _id = 'item', data )
	{
		return this.request( {
			method: 'POST',
			uri: `/${ collection }/${ _id }`,
			json: data
		} );
	}

	getItem( collection, _id = 'items' )
	{
		return this.request( { uri: `/${ collection }/${ _id }` } );
	}

	getItems( collection )
	{
		return this.getItem( collection );
	}

	updateItem( collection, _id, data )
	{
		return this.request( {
			method: 'PUT',
			uri: `/${ collection }/${ _id }`,
			json: data
		} );
	}

	deleteItem( collection, _id )
	{
		return this.request( {
			method: 'DELETE',
			uri: `/${ collection }/${ _id }`
		} );
	}
}

module.export = LightDBAPI;
