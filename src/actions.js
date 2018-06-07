/** ****************************************************************************************************
 * @file: actions.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 07-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	Response   = require( 'http-response-class' ),
	Database   = require( '../src/Database' ),
	Item       = require( '../src/Item' );

module.exports.getDatabaseInformation = () => {
	return new Response( 200, Database.getDatabaseInformation() );
};

module.exports.listCollections = () => {
	return new Response( 200, [ ...Database.listCollections() ] );
};

module.exports.getCollection = ( collection ) => {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			return new Response( 200, Database.getCollection( collection ).getCollectionInformation() );
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
};

module.exports.createCollection = ( collection, metadata ) => {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			return new Response( 409, `Collection "${ collection }" already exists` );
		} else {
			const db = Database.createCollection( collection, metadata ).get( collection );
			return new Response( 200, db );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
};

module.exports.updateCollection = ( collection, metadata ) => {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			Database.getCollection( collection ).updateMetadata( metadata );

			return new Response( 200, Database.getCollection( collection ).getCollectionInformation() );
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
};

module.exports.deleteCollection = ( collection ) => {
	if( collection ) {
		if( Database.deleteCollection( collection ) ) {
			return new Response( 202, {} );
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
};

module.exports.listItems = ( collection ) => {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			const db = Database.getCollection( collection );

			return new Response( 200, [ ...db.listItems() ] );
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
};

module.exports.getItem = ( collection, _id ) => {
	if( collection && _id ) {
		if( Database.hasCollection( collection ) ) {
			const db = Database.getCollection( collection );

			if( db.hasItem( _id ) ) {
				return new Response( 200, db.getItem( _id ) );
			} else {
				return new Response( 404, `Item "${ _id }" not found` );
			}
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name and item id' );
	}
};

module.exports.createItem = ( collection, { _id, ...data } ) => {
	if( collection && data ) {
		if( Database.hasCollection( collection ) ) {
			const db = Database.getCollection( collection );

			if( db.hasItem( _id ) ) {
				return new Response( 409, `Item "${ _id }" already exists` );
			} else {
				const item = new Item( _id, data );

				db.createItem( item.getId(), item );

				return new Response( 201, item );
			}
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name and item data' );
	}
};

module.exports.updateItem = ( collection, { _id, ...data } ) => {
	if( collection && data ) {
		if( Database.hasCollection( collection ) ) {
			const db = Database.getCollection( collection );

			if( db.hasItem( _id ) ) {
				return new Response( 202, db.updateItem( _id, data ) );
			} else {
				return new Response( 404, `Item "${ _id }" not found` );
			}
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name and item data' );
	}
};

module.exports.deleteItem = ( collection, _id ) => {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			if( Database.getCollection( collection ).deleteItem( _id ) ) {
				return new Response( 202, {} );
			} else {
				return new Response( 404, `Item "${ _id }" not found` );
			}
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name and item id' );
	}
};

