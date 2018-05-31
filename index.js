/** ****************************************************************************************************
 * File: index.js
 * Project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-May-2018
 *******************************************************************************************************/
'use strict';

const
	{
		description,
		name,
		version
	} = require( './package' );

( function() {
	if( process.argv.includes( '-v' ) || process.argv.includes( '--version' ) ) {
		return console.log( `v${ version }` );
	} else if( process.argv.includes( '-h' ) || process.argv.includes( '--help' ) ) {
		return console.log( [
			`Welcome to ${ name }`,
			`    Version: v${ version }`,
			'',
			description,
			'',
			`Usage:  ${ name } [options]`,
			'',
			'    -h, --help         help menu',
			`    -v, --version      print ${ name } version`,
			`    -s, --silent       run ${ name } in silent mode`,
			`    -p, --port [port]  set the port to start ${ name } on`
		].join( '\n' ) );
	}

	function parseArguments( args, defaults = {} ) {
		args = args.splice( 2 );

		return args.reduce(
			( r, item, i ) => {
				if( /(-s)|(--silent)/i.test( item ) ) {
					r.silent = true;
				} else if( /(-d)|(--data)/i.test( item ) ) {
					const arg = args[ i + 1 ];

					if( !arg ) {
						console.error( 'Argument Error: -d, --data option must be specified' );
						process.exit( 1 );
					} else {
						r.data = arg;
					}
				} else if( /(-p)|(--port)/i.test( item ) ) {
					const arg = +args[ i + 1 ];

					if( !arg ) {
						console.error( 'Argument Error: -p, --port option must be a number' );
						process.exit( 1 );
					} else {
						r.port = arg;
					}
				}

				return r;
			}, defaults
		);
	}

	const
		args = parseArguments( process.argv, {
			silent: false,
			port: 23000
		} );

	Object.keys( args )
		.forEach(
			k => process.env[ k ] = process.env[ k ] || args[ k ]
		);

	require( './server' )( require( './config' ) )
		.initialize()
		.then( inst => inst.start() );
} )();
