const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
	entry: {
		app: './src/js/app.js'
	},
	output: {
		path: path.join(__dirname, 'dist/js'),
		filename: '[name].js',
	},
	devtool: argv.mode === 'production' ? false : 'source-map',
	cache: false,
	module: {
		rules: [
			{
				test: /\.?js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(argv.mode),
	})]
});