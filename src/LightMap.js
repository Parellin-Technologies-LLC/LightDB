/** ****************************************************************************************************
 * File: LightMap.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

class LightMap extends Map
{
	constructor( ...args )
	{
		super( ...args );
	}

	reduce( fn, r, iterator = this[ Symbol.iterator ]() )
	{
		for( const [ key, value ] of iterator ) {
			r = fn( r, [ key, value ], key, this );
		}

		return r;
	}

	filter( fn )
	{
		const arr = new LightMap();

		for( const [ key, value ] of this[ Symbol.iterator ]() ) {
			if( fn( value, key, this ) ) {
				arr.set( key, value );
			}
		}

		return arr;
	}

	map( fn )
	{
		const arr = new LightMap();

		for( const [ key, value ] of this[ Symbol.iterator ]() ) {
			let entry = fn( value, key, this );

			if( !entry ) {
				entry = [ undefined, undefined ];
			}

			arr.set( entry[ 0 ] || key, entry[ 1 ] || value );
		}

		return arr;
	}

	sortKeys( fn )
	{
		const keys = [ ...this.keys() ].sort( fn );
		let i      = 0;

		return this.map(
			( v, k, iterator ) => {
				const key = keys[ i++ ];
				return [ key, iterator.get( key ) ];
			}
		);
	}

	// TODO::: get back to this
	// sortValues( fn )
	// {
	// 	const
	// 		iterator = this[ Symbol.iterator ](),
	// 		arr      = [];
	//
	// 	let
	// 		done    = false,
	// 		current = null,
	// 		next    = null;
	//
	// 	while( !done ) {
	// 		if( !current ) {
	// 			current = iterator.next();
	// 		}
	//
	// 		next = iterator.next();
	// 		done = next.done;
	//
	// 		if( done ) {
	// 			return;
	// 		}
	//
	// 		const x = fn.call( arr, current.value[ 1 ], next.value[ 1 ] );
	//
	// 		console.log( x );
	// 		current = next;
	// 	}
	//
	// 	return arr;
	// }
}

module.exports = LightMap;


/*

 SAVED FOR TESTING PURPOSES

 const
 LightMap = require( './src/LightMap' );

 const map = new LightMap();

 map.set( 123, 'abc' );
 map.set( 1, 'a' );
 map.set( 12, 'ab' );

 console.log( map );
 console.log( map.sortKeys( function( a, b ) {
 return b - a;
 } ) );
 */