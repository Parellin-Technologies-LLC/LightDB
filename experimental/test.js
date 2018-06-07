/** ****************************************************************************************************
 * File: test.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-May-2018
 *******************************************************************************************************/
'use strict';

// const
// 	LightMap = require( './src/LightMap' ),
// 	Database = require( './src/Database' ),
// 	UUIDv4   = require( 'uuid/v4' ),
// 	_id      = 'database',
// 	metadata = { description: 'do stuff' };
// Database.createCollection( _id, metadata );

const _id     = 'database';
const request = require( 'request' );

function takeCreateFrame() {
	const totalStart = process.hrtime();
	const tasks      = [];
	let i            = 0;

	for( ; i < 10; i++ ) {
		const start = process.hrtime();
		tasks.push(
			new Promise(
				( res, rej ) => request.post(
					`http://127.0.0.1:23000/${ _id }/item`,
					{ json: [ { key: 'value' }, { key: 'value' }, { key: 'value' } ] },
					( e, r, d ) => {
						res( process.hrtime( start ) );
					}
				)
			)
		);
	}

	return Promise.all( tasks )
		.then( d => {
			const totalEnd = process.hrtime( totalStart );
			const average  = d.reduce( ( r, [ x, y ] ) => {
				r += y;
				return r;
			}, 0 );

			return {
				type: 'CREATE',
				itemAverage: average / d.length,
				totalTome: totalEnd[ 1 ]
			};
		} );
}

function takeScanFrame() {
	const totalStart = process.hrtime();
	const tasks      = [];
	let i            = 0;

	for( ; i < 10; i++ ) {
		const start = process.hrtime();
		tasks.push(
			new Promise(
				( res, rej ) => request.get(
					`http://127.0.0.1:23000/${ _id }/items`,
					( e, r, d ) => {
						res( process.hrtime( start ) );
					}
				)
			)
		);
	}

	return Promise.all( tasks )
		.then( d => {
			const totalEnd = process.hrtime( totalStart );
			const average  = d.reduce( ( r, [ x, y ] ) => {
				r += y;
				return r;
			}, 0 );

			return {
				type: 'SCAN',
				itemAverage: average / d.length,
				totalTome: totalEnd[ 1 ]
			};
		} );
}

function wait( n ) {
	return new Promise(
		res => setTimeout( () => res(), n )
	);
}

// Promise.all( [
// 	takeCreateFrame(), wait( 100 ), takeScanFrame(), wait( 100 )
// ] )
// 	.then( d => d.filter( Boolean ).sort() )
// 	.then( d => d.forEach( i => console.log( `${ JSON.stringify( i ) },` ) ) );
