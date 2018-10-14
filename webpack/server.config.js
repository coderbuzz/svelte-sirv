const nodeExternals = require('webpack-node-externals');
const path = require('path');
const { exec } = require('child_process');

const mode = process.env.NODE_ENV || 'development';
// const prod = mode === 'production';

// console.log('MODE:', mode);

module.exports = {
	entry: {
		server: ['./src/server.js']
	},
	output: {
		filename: '[name].js',
		libraryTarget: "commonjs-module",
		path: path.resolve(__dirname, '../build')
	},
	target: 'node',
	resolve: {
		extensions: ['.js'],
	},

	externals: [
		nodeExternals(),

		// function(context, request, callback) {

		// 	console.log('EXTERNAL', request)
		// 	if (request == './../package.json') {
		// 	  	return callback(null, 'commonjs ' + request);
		// 	}
		// 	callback();
		// }
	],
	// module: {},
	// mode: process.env.NODE_ENV,
	mode,
	node: {
        __dirname: false
    },
	performance: {
		hints: false // it doesn't matter if server.js is large
	}
}
