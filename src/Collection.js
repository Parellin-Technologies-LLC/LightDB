/** ****************************************************************************************************
 * File: Collection.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	LightMap = require( './LightMap' ),
	UUIDv4   = require( 'uuid/v4' );

class Collection
{
	constructor( _id, metadata )
	{
		this._id      = _id || UUIDv4();
		this.data     = new LightMap();
		this.metadata = { ...metadata };
		
		this.metadata.created  = new Date().toString();
		this.metadata.modified = this.metadata.created;
	}
	
	getId()
	{
		return this._id;
	}
	
	getData()
	{
		return this.data;
	}
	
	getSize()
	{
		return this.data.size;
	}
	
	getMetadata()
	{
		return this.metadata;
	}
	
	toJSON()
	{
		return {
			_id: this.getId(),
			data: this.getData(),
			metadata: this.getMetadata(),
			size: this.getSize()
		};
	}
	
	hasItem( collection, id )
	{
		return this.getData().has( id );
	}
	
	listItems( collection )
	{
		return this.getData().values();
	}
	
	getItem( collection, id )
	{
		return this.getData().get( id );
	}
	
	createItem( collection, id, data )
	{
		return this.getData().set( id, data );
	}
	
	deleteItem( collection, id )
	{
		return this.getData().delete( id );
	}
}

module.exports = Collection;
