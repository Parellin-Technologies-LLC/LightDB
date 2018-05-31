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
	
	sortValues( fn )
	{
		// return [ ...this.entries() ].sort( function( a, b ) {
		// 	return a[ 1 ] - b[ 1 ];
		// } );
		const iterator = this[ Symbol.iterator ]();
		
		let
			done    = false,
			current = null,
			next    = null;
		
		while( !done ) {
			const item = iterator.next();
			
			// current    = item.value;
			next       = iterator.next().value;
			
			done = item.done;
			
			console.log( item.value, next );
			
			current = next;
			// next = current;
			
			if( done ) {
				return;
			}
		}
		
		for( const entry of this[ Symbol.iterator ]() ) {
			console.log( entry, iterator.next().value );
			fn( entry, iterator.next().value );
		}
		
		return [ ...this.entries() ].sort( console.log );
		
		return '';
		return this.map(
			( v, k, iterator ) => {
				// const value = values[ i++ ];
				// return [ key, iterator.get( key ) ];
			}
		);
	}
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