const webpack = require('webpack');
const helpers = require('./helpers');

/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
const AssetsPlugin = require('assets-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const RuntimeExtendPlugin = require("./runtimeExtendPlugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ChunkIdConverterPlugin = require('./chunkIdConverterPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');


/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  title: 'RolePlay V2.0',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  appPrefix: '',
  nodePrefix: ''
};

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  const isProd = options.env === 'production';

  if(!isProd){
    METADATA.appPrefix = "src/";
    METADATA.nodePrefix = "node_modules/"
  }

  return {
    /*
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * See: http://webpack.github.io/docs/configuration.html#cache
     */
    // cache: false,

    /*
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
      'polyfills': './src/polyfills.browser.ts',
      'vendor':    './src/vendor.browser.ts',
      'main':      './src/main.browser.ts'
    },

    /*
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
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

    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      // rules: [
      loaders: [

        /*
         * Typescript loader support for .ts and Angular 2 async routes via .async.ts
         * Replace templateUrl and stylesUrl with require()
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader
         * See: https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          // use: [
          //   '@angularclass/hmr-loader?pretty=' + !isProd + '&prod=' + isProd,
          //   'awesome-typescript-loader',
          //   'angular2-template-loader',
          //   'angular-router-loader'
          // ],
          loaders: [
            '@angularclass/hmr-loader?pretty=' + !isProd + '&prod=' + isProd,
            'awesome-typescript-loader',
            'angular2-template-loader',
            'angular2-router-loader'
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        /*
         * Json loader support for *.json files.
         *
         * See: https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          loader: 'json-loader'
        },


        {
          test: /\.css$/,
          exclude: helpers.root('src', 'app'),
          loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
        },

        /*
         * to string and css loader support for *.css files
         * Returns file content as string
         *
         */
        {
          test: /\.css$/,
          include: helpers.root('src', 'app'),
          loaders: ['to-string-loader', 'css-loader']
        },

        {
          test: /\.scss$/,
          exclude: helpers.root('src', 'app'),
          // loader: ExtractTextPlugin.extract('style', 'css?sourceMap','resolve-url','postcss','sass?sourceMap') 
          loader: ExtractTextPlugin.extract('style', 'css?sourceMap','resolve-url','sass?sourceMap') 
        },

        {
          test: /\.scss$/,
          exclude: /node_modules/,
          include: helpers.root('src', 'app'),
          // loader: 'style-loader!css-loader!sass-loader'
          loaders: ['to-string-loader', 'css-loader','sass-loader']
        },


        /* Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        },
      
        /* File loader for supporting images, for example, in CSS files.
         */
        {
          test: /\.(jpg|png|gif)$/,
          loader: 'file-loader'
        },

        { 
          test: /\.(woff2?|ttf|eot|svg)$/, 
          loader: 'url?limit=10000' 
        },

        // Bootstrap 4
        // { 
        //   test: /bootstrap\/dist\/js\/umd\//, 
        //   loader: 'imports?jQuery=jquery' 
        // }
      ]
    },

    plugins: [
      // Plugin to show any webpack warnings and prevent tests from running
      function () {
        let errors = []
        this.plugin('done', function (stats) {
          if (stats.compilation.errors.length) {
            // Log each of the warnings
            stats.compilation.errors.forEach(function (error) {
              errors.push(error.message || error)
            })

            // Pretend no assets were generated. This prevents the tests
            // from running making it clear that there were warnings.
            if(isProd){
              throw new Error(errors)
            }else{
              errors.forEach(function(error){
                if(!error.startsWith("[at-loader]")){
                  throw new Error(errors)
                }
              });
            }
          }
        })
      },

      new AssetsPlugin({
        path: helpers.root('dist'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),

      new ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
          jquery: 'jquery'
      }),

      // new ChunkIdConverterPlugin(),
      /*
       * Plugin: ForkCheckerPlugin
       * Description: Do type checking in a separate process, so webpack don't need to wait.
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
       */
      // new ForkCheckerPlugin(),
      new RuntimeExtendPlugin(),
      /*
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      new CommonsChunkPlugin({
        name: [ 'vendor','polyfills']
      }),

      /**
       * Extract webpack runtime code to manifest.
      */
      // new CommonsChunkPlugin({
      //   name: 'manifest',
      //   chunks: ['polyfills']
      // }),

      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('../lib/vendor-manifest.json')
      }),
      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
       */
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
        helpers.root('src'), // location of your src
        {
          // your Angular Async Route paths relative to this root directory
        }
      ),

      /*
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
      new CopyWebpackPlugin([
        { from: 'src/assets', to: 'assets' },
        { from: 'src/roleplay-config.js'},
        { from: 'lib/vendor.dll.js',to: 'lib/vendor.dll.js'},
        { from: 'node_modules/primeng/resources/primeng.min.css',to: 'primeng/resources/primeng.min.css'},
        { from: 'node_modules/primeng/resources/themes/omega',to: 'primeng/resources/themes/omega'},
        { from: 'node_modules/balloon-css/balloon.min.css',to: 'balloon-css/balloon.min.css'},
        { from: 'node_modules/rp-dynamic-form/assets/roleplay.css',to: 'rp-dynamic-form/assets/roleplay.css'}
        
      ]),
      
      new CopyWebpackPlugin([
        { from: 'src/assets', to: 'src/assets'},
        { from: 'src/app/process/dynamic-form', to: 'src/app/process/dynamic-form'},
      ]),


      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename : 'index.html',
        title: METADATA.title,
        chunksSortMode: 'dependency',
        metadata: METADATA,
        inject: 'head'
      }),

      /*
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      // new LoaderOptionsPlugin({}),

      // Fix Angular 2
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)async/,
        helpers.root('node_modules/@angular/core/src/facade/async.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)collection/,
        helpers.root('node_modules/@angular/core/src/facade/collection.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)errors/,
        helpers.root('node_modules/@angular/core/src/facade/errors.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)lang/,
        helpers.root('node_modules/@angular/core/src/facade/lang.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)math/,
        helpers.root('node_modules/@angular/core/src/facade/math.js')
      )
    ],
    postcss: [autoprefixer],
    
    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
   

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
}
