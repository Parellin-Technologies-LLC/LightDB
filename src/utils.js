/** ****************************************************************************************************
 * @file: utils.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	LOG_KIBIBYTE = Math.log( 1024 );

/**
 * bytesToSize
 * @description
 *     Convert bytes to human readable format
 * @param {bytes} bytes - unit in bytes to parse
 * @returns {string} - pretty string in the format [n unit]
 * @example
 * bytesToSize( 1073741824 ) // -> 1 GB
 */
function bytesToSize( bytes ) {
	if( !bytes ) {
		return '0 Byte';
	}

	const
		sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ],
		i     = ~~( Math.log( bytes ) / LOG_KIBIBYTE );

	return Math.round( bytes / Math.pow( 1024, i ) ) + ' ' + sizes[ i ];
}

module.exports = {
	LOG_KIBIBYTE,
	bytesToSize
};
