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
	
	hasCollection( k )
	{
		return this.collections.has( k );
	}
}

module.exports = new Database();
