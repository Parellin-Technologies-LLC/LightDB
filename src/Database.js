/** ****************************************************************************************************
 * File: Database.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

class Database
{
	constructor()
	{
		this.collections = new Map();
	}

	hasCollection( collection )
	{
		return this.collections.has( collection );
	}

	listCollections()
	{
		return this.collections.keys();
	}

	getCollection( collection )
	{
		return this.collections.get( collection );
	}

	createCollection( collection )
	{
		return this.collections.set( collection, new Map() ).keys();
	}

	deleteCollection( collection )
	{
		return this.collections.delete( collection );
	}



	hasItem( collection, id )
	{
		return this.getCollection( collection ).has( id );
	}

	listItems( collection )
	{
		return this.getCollection( collection ).values();
	}

	getItem( collection, id )
	{
		return this.getCollection( collection ).get( id );
	}

	createItem( collection, id, data )
	{
		return this.getCollection( collection ).set( id, data );
	}

	deleteItem( collection, id )
	{
		return this.getCollection( collection ).delete( id );
	}
}

module.exports = new Database();
