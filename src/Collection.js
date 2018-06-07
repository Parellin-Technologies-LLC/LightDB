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

	hasItem( _id )
	{
		return this.getData().has( _id );
	}

	listItems()
	{
		return this.getData().values();
	}

	getItem( _id )
	{
		return this.getData().get( _id );
	}

	createItem( _id, data )
	{
		if( !( data instanceof Item ) ) {
			data = new Item( _id, data );
		}

		data._collection = this.getId();

		return this.getData().set( _id, data );
	}

	updateItem( _id, data )
	{
		const item = this.getItem( _id );
		return item.updateData( data );
	}

	deleteItem( _id )
	{
		return this.getData().delete( _id );
	}

	getCollectionInformation()
	{
		const
			items          = this.getData(),
			itemCount      = this.getItemCount(),
			collectionSize = items.reduce(
				( r, [ k, { data } ] ) => {
					r += k.length;
					r += JSON.stringify( data ).length;
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
