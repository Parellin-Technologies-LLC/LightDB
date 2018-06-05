/** ****************************************************************************************************
 * @file: Item.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const UUIDv4 = require( 'uuid/v4' );

class Item
{
	constructor( _id, data )
	{
		this._id      = _id || UUIDv4();
		this.created  = new Date().toString();
		this.data     = data;
		this.modified = this.created;
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

	toJSON()
	{
		return {
			_id: this._id,
			created: this.created,
			data: this.data,
			modified: this.modified
		};
	}
}

module.exports = Item;
