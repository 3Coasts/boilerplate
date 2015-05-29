var express = require('express')
  , fs = require('fs')
  , errorhandler = require('errorhandler')
  , bodyParser = require('body-parser')
  , config = require('./config')
  , passport = require('./passport')
  , logger = require('./logger')
  , app = express();

// App config
app.set('environment', config.isDev ? 'development' : 'production');
app.disable('x-powered-by');
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json(null));
app.use(logger);

// Route handlers
require('./resources').init(app);

// Error handler
if (config.isDev || config.debug) app.use(errorhandler())

app.listen(config.port, function appListen() {
  console.log('Server started!');
})