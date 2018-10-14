const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const pkg = require('./../src/package.json');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const fso = require('fs');

function appEntries() {
	const result = {};

	// fs.removeSync('build/client');

	

	// fs.remove('build/client').then(() => {

		// setTimeout(function () {

			pkg.apps.mount.forEach(name => {
				if (name == pkg.apps.default) {
					fs.copy('src/apps/' + name + '/client/assets', 'build/client', function () {
		
						exec('cat ' + 'src/apps/' + name + '/client/vendor/css/*.css >> build/client/vendor.css', (error, stdout, stderr) => {
							if (error) {
								console.error(`exec cat error: ${error}`);
							}
						});
						
						exec('cat ' + 'src/apps/' + name + '/client/vendor/js/*.js >> build/client/vendor.js', (error, stdout, stderr) => {
							if (error) {
								console.error(`exec cat error: ${error}`);
							}
						});
					});	
				} else {
					fs.copy('src/apps/' + name + '/client/assets', 'build/client/' + name, function () {
		
						exec('cat ' + 'src/apps/' + name + '/client/vendor/css/*.css >> build/client/' + name + '/vendor.css', (error, stdout, stderr) => {
							if (error) {
								console.error(`exec cat error: ${error}`);
							}
						});
						
						exec('cat ' + 'src/apps/' + name + '/client/vendor/js/*.js >> build/client/' + name + '/vendor.js', (error, stdout, stderr) => {
							if (error) {
								console.error(`exec cat error: ${error}`);
							}
						});
					});
				}
			});
			
		// }, 2000);

		
	// })
	
	pkg.apps.mount.forEach(name => {
		if (name == pkg.apps.default) {
			result['app'] = './src/apps/' + name + '/client/app/index.js';
		} else {
			result[name + '/app'] = './src/apps/' + name + '/client/app/index.js';
		}
	});

	return result;
}

module.exports = {
	devServer: {
		contentBase: path.resolve(__dirname, '../build/client'),
		// compress: true,
		// port: 3000,
		stats: 'minimal',
		clientLogLevel: 'none',
		open: true,
		proxy: {
			'/': {
				target: 'http://127.0.0.1:3000',
				// bypass: function (req, res, proxyOptions) {
				// 	if (req.headers.accept.indexOf('html') !== -1) {
				// 		console.log('Skipping proxy for browser request.');
				// 		return '/index.html';
				// 	}
				// }
			}
		}  
	},

	// entry: {
	// 	bundle: ['./src/client.js']
	// },

	entry: appEntries(),

	resolve: {
		extensions: ['.js', '.html']
	},
	output: {
		path: path.resolve(__dirname, '../build/client'),
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						skipIntroByDefault: true,
						nestedTransitions: true,
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	],
	devtool: prod ? false : 'source-map'
}
