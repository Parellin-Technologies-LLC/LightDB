/** ****************************************************************************************************
 * File: Database.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	Collection = require( './Collection' ),
	LightMap   = require( './LightMap' );

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
	
	getCollectionInformation( _id )
	{
		return {
			_id,
			...this.getCollection( _id ).metadata
		};
	}
	
	createCollection( _id, metadata )
	{
		return this.collections.set( _id, new Collection( _id, metadata ) );
	}
	
	deleteCollection( _id )
	{
		return this.collections.delete( _id );
	}
}

module.exports = new Database();
