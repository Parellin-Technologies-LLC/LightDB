/** ****************************************************************************************************
 * @file: actions.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 07-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( '../src/Database' ),
	Item     = require( '../src/Item' ),
	{
		isArray
	}        = require( './utils' );

function getDatabaseInformation() {
	return new Response( 200, Database.getDatabaseInformation() );
}

function listCollections() {
	return new Response( 200, [ ...Database.listCollections() ] );
}

function getCollection( collection, data, parameters = {} ) {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			return new Response( 200, Database.getCollection( collection ).getCollectionInformation() );
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
}

function createCollection( collection, data, parameters = {} ) {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			if( parameters.skipIfExists ) {
				return new Response( 200, Database.getCollection( collection ).getCollectionInformation() );
			} else {
				return new Response( 409, `Collection "${ collection }" already exists` );
			}
		} else {
			const db = Database.createCollection( collection, data ).get( collection );
			return new Response( 200, db );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
}

function updateCollection( collection, data, parameters = {} ) {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			Database.getCollection( collection ).updateMetadata( data );

			return new Response( 200, Database.getCollection( collection ).getCollectionInformation() );
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
}

function deleteCollection( collection, data, parameters = {} ) {
	if( collection ) {
		if( Database.deleteCollection( collection ) ) {
			return new Response( 202, {} );
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
}

function listItems( collection, data, parameters = {} ) {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			const db = Database.getCollection( collection );

			if( parameters.keysOnly ) {
				return new Response( 200, [ ...db.listKeys() ] );
			} else {
				return new Response( 200, [ ...db.listItems() ] );
			}
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name' );
	}
}

function hasItem( collection, data, parameters = {} ) {
	const _id = data._id || data;

	if( collection && _id ) {
		if( Database.hasCollection( collection ) ) {
			const db = Database.getCollection( collection );

			return new Response( 200, db.hasItem( _id ) );
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name and item id' );
	}
}

function getItem( collection, data, parameters = {} ) {
	const _id = data._id || data;

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
}

function createItem( collection, { _id, tags = [], ...data }, parameters = {} ) {
	if( collection && data ) {
		if( Database.hasCollection( collection ) ) {
			const db = Database.getCollection( collection );

			if( db.hasItem( _id ) && !parameters.forceOverwrite ) {
				if( parameters.skipIfExists ) {
					return new Response( 200, db.getItem( _id ) );
				} else {
					return new Response( 409, `Item "${ _id }" already exists` );
				}
			} else {
				const item = new Item( _id, data, tags );

				if( !parameters.dryRun ) {
					db.createItem( item.getId(), item );
				}

				return new Response( 201, item );
			}
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name and item data' );
	}
}

function updateItem( collection, { _id, data }, parameters = {} ) {
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
}

function deleteItem( collection, data, parameters = {} ) {
	const _id = data._id || data;

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
}

function bulkCreate( collection, data, parameters = {} ) {
	if( collection ) {
		if( Database.hasCollection( collection ) ) {
			if( isArray( data ) ) {
				const run = ( dryRun = false ) => {
					parameters.dryRun = dryRun;

					return data
						.map( d => createItem( collection, d, parameters ) )
						.filter( d => dryRun ? !d.isSuccess() : d.isSuccess() );
				};

				const test = run( true );

				if( test.length ) {
					return new Response( 400, test );
				}

				data = run( false ).map( ( { data } ) => data );

				return new Response( 201, data );
			} else {
				return new Response( 417, 'Data must be an array' );
			}
		} else {
			return new Response( 404, `Collection "${ collection }" not found` );
		}
	} else {
		return new Response( 400, 'Argument Error - must specify collection name and item id' );
	}
}

module.exports.getDatabaseInformation = getDatabaseInformation;
module.exports.listCollections        = listCollections;
module.exports.getCollection          = getCollection;
module.exports.createCollection       = createCollection;
module.exports.updateCollection       = updateCollection;

module.exports.deleteCollection = deleteCollection;
module.exports.listItems        = listItems;
module.exports.hasItem          = hasItem;
module.exports.getItem          = getItem;
module.exports.createItem       = createItem;
module.exports.updateItem       = updateItem;
module.exports.deleteItem       = deleteItem;

module.exports.bulkCreate = bulkCreate;

module.exports.list   = listItems;
module.exports.query  = listItems;
module.exports.has    = hasItem;
module.exports.get    = getItem;
module.exports.put    = createItem;
module.exports.delete = deleteItem;
