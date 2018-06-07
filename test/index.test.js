/** ****************************************************************************************************
 * @file: index.test.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	config         = require( '../config' ),
	chai           = require( 'chai' ),
	chaiHTTP       = require( 'chai-http' ),
	chaiAsPromised = require( 'chai-as-promised' ),
	expect         = chai.expect,
	should         = chai.should(),
	UUIDv4         = require( 'uuid/v4' ),
	TIMEOUTDELAY   = 1600;

chai.use( chaiHTTP );
chai.use( chaiAsPromised );
config.port = 23001;

describe( 'LightDB', () => {
	let
		server = require( '../server' )( config ),
		table, app;

	it( 'should have instance of express',
		() => server
			.initialize()
			.then( inst => server = inst )
			.should.eventually.have.property( 'express' )
	);

	it( 'should set port in process.config',
		() => expect( process.config.port ).to.be.a( 'number' )
	);

	it( 'should have SIGINT process handler',
		() => expect( process.listeners( 'SIGINT' ).length ).to.be.at.least( 1 )
	);

	it( 'should have uncaughtException process handler',
		() => expect( process.listeners( 'uncaughtException' ).length ).to.be.at.least( 1 )
	);

	it( 'should have unhandledRejection process handler',
		() => expect( process.listeners( 'unhandledRejection' ).length ).to.be.at.least( 1 )
	);

	it( 'should have exit process handler',
		() => expect( process.listeners( 'exit' ).length ).to.be.at.least( 1 )
	);

	it( 'should not have binding to port',
		() => expect( server ).to.not.have.property( 'server' )
	);

	it( 'should start the program', function( done ) {
		this.timeout( 5000 );
		server.start()
			.then( () => done() );
	} );

	it( 'should have bind to port', () => {
		expect( server.server.address() )
			.to.have.property( 'port' )
			.and.eq( process.config.port );

		app = server.express;
	} );

	describe( 'LightDB API', () => {
		it( '/ping    return "pong" 200 OK',
			done => {
				chai
					.request( app )
					.get( '/ping' )
					.end(
						( e, d ) => {
							expect( d ).to.have.status( 200 );
							expect( d.body ).to.eq( 'pong' );
							done();
						}
					);
			}
		);
	} );

	after( () => process.exit( 0 ) );
} );

// const
// 	cId = '__main__',
// 	iId = '__item__',
// 	x   = [
// 		LDB.ping(),
// 		LDB.version(),
// 		LDB.databaseInfo(),
// 		LDB.toJSON(),
//
// 		LDB.listCollections(),
//
// 		LDB.deleteCollection( cId ),
// 		LDB.createCollection( cId, { hello: 'world' } ),
// 		LDB.getCollection( cId ),
// 		LDB.updateCollection( cId, { hello: 'worlds' } ),
//
// 		LDB.createItem( cId, iId, { hello: 'item' } ),
// 		LDB.getItems( cId ),
// 		LDB.getItem( cId, iId ),
// 		LDB.updateItem( cId, iId, { hello: 'items' } ),
// 		LDB.deleteItem( cId, iId ),
//
// 		LDB.kill()
// 	];
