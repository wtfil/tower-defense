var webpack = require('webpack');

module.exports = {
	context: __dirname + '/public',
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
				test: /phaser/,
				loader: 'imports'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	devServer: {
		hot: true,
		inline: true,
		port: 3000
	}
};
