/** ****************************************************************************************************
 * @file: utils.js
 * @project: LightDB
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 05-Jun-2018
 *******************************************************************************************************/
'use strict';

const
	LOG_KIBIBYTE = Math.log( 1024 );

function _isNotNaN( n ) {
	return ( n === n );
}

function isNaN( ...n ) {
	return !n.filter( _isNotNaN ).length;
}

function _isNotUndefined( n ) {
	return ( n !== undefined );
}

function isUndefined( ...n ) {
	return !n.filter( _isNotUndefined ).length;
}

function _isNotNull( n ) {
	return ( n !== null );
}

function isNull( ...n ) {
	return !n.filter( _isNotNull ).length;
}

function _isNotBoolean( n ) {
	return ( !!n !== n );
}

function isBoolean( ...n ) {
	return !n.filter( _isNotBoolean ).length;
}

function _isNotString( n ) {
	return ( '' + n !== n );
}

function isString( ...n ) {
	return !n.filter( _isNotString ).length;
}

function _isNotNumber( n ) {
	return ( +n !== n );
}

function isNumber( ...n ) {
	return !n.filter( _isNotNumber ).length;
}

function _isNotPrimitive( n ) {
	return _isNotBoolean( n ) && _isNotString( n ) && _isNotNumber( n );
}

function isPrimitive( ...n ) {
	return !n.filter( _isNotPrimitive ).length;
}

function _isNotArray( n ) {
	return !Array.isArray( n );
}

function isArray( ...n ) {
	return !n.filter( _isNotArray ).length;
}

function _isNotObject( n ) {
	return !( _isNotArray( n ) && typeof n === 'object' );
}

function isObject( ...n ) {
	return !n.filter( _isNotObject ).length;
}

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
	isNaN,
	isUndefined,
	isNull,
	isBoolean,
	isString,
	isNumber,
	isPrimitive,
	isArray,
	isObject,
	bytesToSize
};
