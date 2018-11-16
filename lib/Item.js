/** ****************************************************************************************************
 * @file: Item.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	UUIDv4 = require( 'uuid/v4' ),
	{
		isArray,
		isObject
	}      = require( './utils' );

class Item
{
	constructor( _id, data, tags = [], ttl )
	{
		this._id      = _id || UUIDv4();
		this.created  = new Date().toString();
		this.data     = data;
		this.modified = this.created;
		this.tags     = [ ...( data.tags || tags ) ];

		if( ttl ) {
			this.ttl = ttl;
		}
	}

	getId()
	{
		return this._id;
	}

	getData()
	{
		return this.data;
	}

	updateData( d )
	{
		this.modified = new Date().toString();
		this.data     = d;
		return this;
	}

	getTags()
	{
		return this.tags;
	}

	addTag( v )
	{
		this.tags.push( v );
		return this.tags;
	}

	toJSON()
	{
		return {
			_id: this._id,
			created: this.created,
			data: this.data,
			modified: this.modified,
			tags: this.tags
		};
	}

	toString()
	{
		return JSON.stringify( this.toJSON() );
	}

	static [ Symbol.hasInstance ]( obj )
	{
		return ( obj && isObject( obj ) ) &&
			(
				obj.hasOwnProperty( '_id' ) &&
				obj.hasOwnProperty( 'data' ) &&
				(
					obj.data.hasOwnProperty( 'tags' ) ?
						isArray( obj.data.tags ) :
						true
				)
			);
	}
}

module.exports = Item;
