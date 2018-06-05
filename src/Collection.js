/** ****************************************************************************************************
 * File: Collection.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	LightMap        = require( './LightMap' ),
	Item            = require( './Item' ),
	UUIDv4          = require( 'uuid/v4' ),
	{ bytesToSize } = require( './utils' );

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

	getItemCount()
	{
		return this.data.size;
	}

	getMetadata()
	{
		return this.metadata;
	}

	updateMetadata( d )
	{
		const
			{ created } = this.metadata,
			modified    = new Date().toString();

		this.metadata = {
			...d,
			created,
			modified
		};
	}

	hasItem( id )
	{
		return this.getData().has( id );
	}

	listItems()
	{
		return this.getData().values();
	}

	getItem( id )
	{
		return this.getData().get( id );
	}

	createItem( id, data )
	{
		if( !( data instanceof Item ) ) {
			data = new Item( id, data );
		}

		data._collection = this.getId();

		return this.getData().set( id, data );
	}

	updateItem( id, data )
	{
		const item = this.getItem( id );
		return item.updateData( data );
	}

	deleteItem( id )
	{
		return this.getData().delete( id );
	}

	getCollectionInformation()
	{
		const
			items          = this.getData(),
			itemCount      = this.getItemCount(),
			collectionSize = items.reduce(
				( r, [ k, v ] ) => {
					r += JSON.stringify( v ).length;
					return r;
				}, 0
			);

		return {
			_id: this.getId(),
			averageItemSize: bytesToSize( collectionSize / itemCount ),
			collectionSize: bytesToSize( collectionSize ),
			itemCount,
			metadata: this.getMetadata()
		};
	}

	toJSON()
	{
		return {
			_id: this.getId(),
			data: [ ...this.listItems() ],
			metadata: this.getMetadata(),
			itemCount: this.getItemCount()
		};
	}
}

module.exports = Collection;
