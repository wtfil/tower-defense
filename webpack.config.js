var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'source-map',
	context: path.join(__dirname, 'public'),
	entry: './src/index.js',
	output: {
	    path: './public/build',
	    filename: 'index.js',
	    publicPath: 'http://localhost:3000/public/build'
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
