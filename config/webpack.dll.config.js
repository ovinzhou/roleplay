const webpack = require('webpack');
const helpers = require('./helpers');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const ENV = process.env.NODE_ENV;

module.exports = {
	entry: {
		vendor: [
			'../src/polyfills.browser.ts',
			'../src/vendor.browser.ts'
		]
	},
	output: {
		path: helpers.root('lib'),
		filename: '[name].dll.js',
		library: '[name]_library'
	},
	resolve: {

      /*
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['','.ts', '.js', '.json'],

      // An array of directory names to be resolved to the current directory
      modules: [helpers.root('node_modules')],

      root: [
        helpers.root('src/app')
      ]
    },
    module: {
	    loaders: [
	        {
	          test: /\.ts$/,
	          loaders: [
	            'awesome-typescript-loader'
	          ],
	          exclude: [/\.(spec|e2e)\.ts$/]
	        }
    	]
    },
	plugins: [
		new DefinePlugin({
	        'ENV': JSON.stringify(ENV)
	    }),
		new webpack.DllPlugin({
			path: helpers.root('lib','[name]-manifest.json'),
			name: '[name]_library'
		}),
		new NamedModulesPlugin()
	]
}