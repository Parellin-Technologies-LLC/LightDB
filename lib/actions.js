/** ****************************************************************************************************
 * @file: actions.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 07-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	Database = require( './Database' ),
	Item     = require( './Item' ),
	{
		isBoolean,
		isString,
		isArray
	}        = require( './utils' );

function getDatabase() {
	return new Response( 200, Database );
}

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
				let keys = [ ...db.listKeys() ];

				if( parameters.sort && !isBoolean( parameters.sort ) && !isString( parameters.sort ) ) {
					return new Response( 417, 'parameters.sort must be a boolean or string specifying a sort pattern' );
				}

				if( parameters.sort === true ) {
					keys = keys.sort();
				} else if( parameters.sort === '' + parameters.sort ) {
					parameters.sort = parameters.sort.startsWith( 'return' ) ?
						parameters.sort :
						`return ${ parameters.sort }`;

					keys = keys.sort(
						( a, b ) => ( () => {} ).constructor( 'a', 'b', parameters.sort )( a, b )
					);
				}

				return new Response( 200, keys );
			} else {
				let items = [ ...db.listItems() ];

				if( parameters.tags && !isArray( parameters.tags ) && !isString( ...parameters.tags ) ) {
					return new Response( 417, 'parameters.tags must be an array of strings' );
				}

				if( parameters.tags ) {
					items = items.filter(
						item => item.tags &&
							item.tags.filter(
								tag => parameters.tags.includes( tag )
							).length
					);
				}

				return new Response( 200, items );
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
				const item = new Item( _id, data, tags, parameters.ttl );

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
				if( parameters.dryRun ) {
					const item = db.getItem( _id );

					item.modified = new Date().toString();

					return new Response( 202, item );
				} else {
					return new Response( 202, db.updateItem( _id, data ) );
				}
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
			if( Database.getCollection( collection ).hasItem( _id ) ) {
				if( !parameters.dryRun ) {
					Database.getCollection( collection ).deleteItem( _id );
				}

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

function batchCreate( collection, data, parameters = {} ) {
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

module.exports.getDatabase            = getDatabase;
module.exports.getDatabaseInformation = getDatabaseInformation;
module.exports.listCollections        = listCollections;
module.exports.getCollection          = getCollection;
module.exports.createCollection       = createCollection;
module.exports.updateCollection       = updateCollection;
module.exports.deleteCollection       = deleteCollection;

module.exports.listItems  = listItems;
module.exports.hasItem    = hasItem;
module.exports.getItem    = getItem;
module.exports.createItem = createItem;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;

module.exports.batchCreate = batchCreate;
module.exports.batchPut    = batchCreate;

module.exports.list   = listItems;
module.exports.query  = listItems;
module.exports.has    = hasItem;
module.exports.get    = getItem;
module.exports.put    = createItem;
module.exports.delete = deleteItem;
