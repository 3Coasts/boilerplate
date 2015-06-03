var express = require('express')
  , fs = require('fs')
  , errorhandler = require('errorhandler')
  , bodyParser = require('body-parser')
  , config = require('./config')
  , waterline = require('./waterline')
  , logger = require('./logger')
  , events = require('./events')
  , app = express();

events.on('orm-initialized', function(waterline) {

  // App config
  app.models = waterline.collections;
  app.set('environment', config.isDev ? 'development' : 'production');
  app.disable('x-powered-by');
  app.set('view engine', 'jade');
  app.use(express.static('public'));
  app.use(require('./passport').initialize());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json(null));
  app.use(logger);

  require('./resource-views');
  require('./resource-routes');

  // Error handler
  if (config.isDev || config.debug) app.use(errorhandler())

  app.listen(config.port, function appListen() {
    console.log('Server started on port:', config.port);
  });
});

module.exports = app;