/** ****************************************************************************************************
 * File: Database.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	Collection = require( './Collection' ),
	LightMap   = require( '@parellin/lightmap' );

class Database
{
	constructor()
	{
		this.collections = new LightMap();
	}

	hasCollection( _id )
	{
		return this.collections.has( _id );
	}

	listCollections()
	{
		return this.collections.keys();
	}

	getCollections()
	{
		return this.collections;
	}

	getCollection( _id )
	{
		return this.collections.get( _id );
	}

	createCollection( _id, metadata )
	{
		return this.collections.set( _id, new Collection( _id, metadata ) );
	}

	deleteCollection( _id )
	{
		return this.collections.delete( _id );
	}

	getDatabaseInformation()
	{
		return this.getCollections()
			.reduce(
				( r, [ k, v ] ) => {
					const info = v.getCollectionInformation();
					r.collectionCount++;
					r.totalItems += info.itemCount;
					r.collections.push( info );
					return r;
				}, {
					collectionCount: 0,
					totalItems: 0,
					collections: []
				}
			);
	}

	toJSON()
	{
		return [ ...this.listCollections() ].reduce(
			( r, i ) => {
				r.push( this.getCollection( i ) );
				return r;
			}, []
		);
	}
}

module.exports = new Database();
