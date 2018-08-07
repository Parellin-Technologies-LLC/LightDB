/** ****************************************************************************************************
 * @file: ui.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	{ readFile } = require( 'fs' ),
	{ resolve }  = require( 'path' ),
	LightMap     = require( '@parellin/lightmap' ),
	Response     = require( 'http-response-class' ),
	Database     = require( '../src/Database' );

module.exports = ( req, res ) => {
	return new Promise(
		( res, rej ) => readFile(
			resolve( 'ui/index.html' ), 'utf8',
			( e, d ) => e ? rej( e ) : res( d ) )
	)
		.then( file => {
			const
				lm          = new LightMap(),
				collections = [ ...Database.listCollections() ];

			lm.set( '{{ collections }}', collections.reduce(
				( r, i ) => {
					r += `<button class="tablinks" onclick="openTab(event, '${ i }')">${ i }</button>`;
					return r;
				}, ''
			) );

			lm.set( '{{ tabBody }}', collections.reduce(
				( r, i ) => {
					const items = [ ...Database.getCollection( i ).listItems() ];

					let table = `<table style="width:100%"><tr><th>_id</th><th>item</th><th>tags</th></tr>`;

					items.forEach(
						item => {
							table += '<tr>';
							table += `<td style="width:10%">${ item._id }</td>`;
							table += `<td>${ JSON.stringify( item.data ) }</td>`;
							table += `<td>${ JSON.stringify( item.tags ) }</td>`;
							table += '</tr>';
						}
					);

					table += '</table>';

					r += `<div id="${ i }" class="tabcontent">` +
						`<h3>${ i }</h3>` +
						// `<p>${ info }</p>` +
						`<div>${ table }</div>` +
						'</div>';

					return r;
				}, ''
			) );

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
