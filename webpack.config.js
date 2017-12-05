var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'source-map',
	context: path.join(__dirname, 'src'),
	entry: './index.js',
	output: {
	    filename: 'index.js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				loader: 'imports'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	devServer: {
		noInfo: true,
		stats: 'errors-only',
		hot: true,
		inline: true,
		port: 3000
	}
};
