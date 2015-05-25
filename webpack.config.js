var webpack = require('webpack')
  , yeticss = require('yeticss')
  , autoPrefixer = require('autoprefixer-core')
  , ExtractTextPlugin = require('extract-text-webpack-plugin')
  , config = require('./lib/config');

var conf = {
  entry: ["./client/app.js"],
  output: { path: "public/", filename: 'app.js' },
  resolve: { modulesDirectories: ['node_modules'] },
  stylus: { use: [yeticss()] },
  postcss: [autoPrefixer()],
  module: {
    loaders: [
      { test: /\.html$/, loader: "html" },
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
      { test: /\.styl$/, loader: 'style-loader!css-loader!postcss-loader!stylus-loader' },
      { test: /\.(otf|eot|svg|ttf|woff)/, loader: 'url-loader?limit=10000' },
      { test: /\.jade$/, loaders: ['jade'] }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('app.css', { allChunks: true })
  ],
  stats: { colors: true, modules: false, reasons: true },
  storeStatsTo: "./public/build/webpack-stats.txt",
};

if (config.isDev) {
  conf.watch = true;
  conf.keepalive = true;
  conf.failOnError = false;
} else {
  conf.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, output: { comments: false }, sourceMap: false }));
}

module.exports = conf;