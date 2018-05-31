/** ****************************************************************************************************
 * @file: Item.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const UUIDv4 = require( 'uuid/v4' );

class Item
{
	constructor( id, data )
	{
		this.created  = new Date().toString();
		this.modified = this.created;
		this.data     = data;
		this.id       = id || UUIDv4();
	}
	
	toJSON()
	{
		return {
			created: this.created,
			data: this.data,
			id: this.id,
			modified: this.modified
		};
	}
}

module.exports = Item;
