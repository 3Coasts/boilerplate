var webpack = require('webpack')
  , webpackConfig = require('../webpack.config.js')
  , config = require('./config')

var compiler = webpack(webpackConfig);

if (config.isDev)
  compiler.watch({
    aggregateTimeout: 300,
    poll: true
  }, handler);
else
  compiler.run(handler);


function handler (err, stats) {
  if(err) throw err;
  stats = stats.toString({
    chunks: false,
    chunkModules: false,
    modules: false,
    source: false,
    chunkOrigins: false,
    modulesSort: false,
    chunksSort: false,
    assetsSort: false,
    colors: true
  });
  console.log(stats);
}

