'use strict';

module.exports = {
	apps: [
		{
			name: 'lightdb',
			script: 'index.js',
			exec_mode: 'cluster',
			instances: 0,
			maxMemoryRestart: '8G',
			restartDelay: 5000,
			node_args: [
				'--max_old_space_size=8192'
			],
			env: {
				host: '127.0.0.1',
				port: 23000
			}
		}
	]
};
