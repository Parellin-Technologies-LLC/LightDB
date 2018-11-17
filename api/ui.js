/** ****************************************************************************************************
 * @file: ui.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	{ readFileSync } = require( 'fs' ),
	{ resolve }      = require( 'path' ),
	LightMap         = require( '@parellin/lightmap' ),
	Response         = require( 'http-response-class' ),
	IPCClient        = require( '../lib/IPCClient' ),
	htmlPage         = readFileSync( resolve( 'ui/index.html' ), 'utf8' );

module.exports = ( req, res ) => {
	return Promise.resolve( htmlPage )
		.then( async file => {
			const lm                  = new LightMap();
			let { data: collections } = await IPCClient.emit( { action: 'listCollections' } );
			
			lm.set( '{{ collections }}', collections.reduce(
				( r, i ) => {
					r += `<button class="tablinks" onclick="openTab( event, '${ i }' )">${ i }</button>`;
					return r;
				}, ''
			) );
			
			collections = await collections.reduce(
				async ( r, i ) => {
					let items      = await r;
					const { data } = await IPCClient.emit( { action: 'listItems', collection: i } );
					
					let table = `<table style="width:100%"><tr><th>_id</th><th>item</th><th>tags</th></tr>`;
					
					data.forEach(
						item => {
							table += '<tr>';
							table += `<td style="width:10%">${ item._id }</td>`;
							table += `<td>${ JSON.stringify( item.data ) }</td>`;
							table += `<td>${ JSON.stringify( item.tags ) }</td>`;
							table += '</tr>';
						}
					);
					
					table += '</table>';
					
					items += `<div id="${ i }" class="tabcontent">` +
						`<h3>${ i }</h3>` +
						// `<p>${ info }</p>` +
						`<div>${ table }</div>` +
						'</div>';
					
					return items;
				}, Promise.resolve( '' )
			);
			
			lm.set( '{{ tabBody }}', collections );
			
			return file.replace( lm );
		} )
		.then( d => {
			res.headers[ 'Content-Type' ] = 'text/html; charset=utf-8';
			res.respond( new Response( 200, d ) );
		} )
		.catch(
			e => e instanceof Response ?
				res.respond( e ) :
				res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) )
		);
};
