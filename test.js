/** ****************************************************************************************************
 * File: test.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

const
	LightMap = require( './src/LightMap' );

const map = new LightMap();

[ 'abc', 'ab', 'a' ].sort( console.log );

// map.set( 123, 'abc' );
// map.set( 1, 'a' );
// map.set( 12, 'ab' );
map.set( 'abc', 123 );
map.set( 'ab', 12 );
map.set( 'a', 1 );

// console.log( map );
console.log( map.sortValues() );

return;


const
	Database = require( './src/Database' );

const
	UUIDv4   = require( 'uuid/v4' ),
	_id      = UUIDv4(),
	metadata = { description: 'do stuff' };

// create a collection

Database.createCollection( _id, metadata );

// /
const x = Database.getCollections()
	.reduce( ( r, [ k, v ] ) => {
		r.push(
			{
				_id: v.getId(),
				size: v.getSize(),
				metadata: v.getMetadata()
			}
		);
		
		return r;
	}, [] );

console.log( x );


// /collections
console.log( ...Database.listCollections() );

// /:collection
console.log( Database.getCollectionInformation( _id ) );
