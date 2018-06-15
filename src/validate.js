/** ****************************************************************************************************
 * @file: validate.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 07-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	{ superstruct } = require( 'superstruct' ),
	struct          = superstruct( {
		types: {
			any: () => true
		}
	} ),
	Response        = require( 'http-response-class' );

module.exports = {
	Task: {
		action: 'string',
		collection: 'string?',
		parameters: 'object?',
		data: 'any?'
	},
	validate: ( expected, data ) => new Promise(
		( res, rej ) => {
			const validataion = struct( expected ).validate( data );
			
			if( validataion[ 0 ] ) {
				rej( new Response( 417, { error: validataion[ 0 ].message, expected } ) );
			} else {
				res( validataion[ 1 ] );
			}
		}
	)
};
