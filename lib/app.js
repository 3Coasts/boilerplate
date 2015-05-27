var express = require('express')
  , fs = require('fs')
  , errorhandler = require('errorhandler')
  , bodyParser = require('body-parser')
  , config = require('./config')
  , passport = require('./passport')
  , logger = require('./logger')
  , app = express();

/*APP CONFIG*/
app.set('environment', config.isDev ? 'development' : 'production');
app.set('view engine', 'jade');
app.set('views', './jade');
app.disable('x-powered-by');
app.use(express.static('public'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger);

/*HTTP ROUTES*/
require('./resources').init(app);

/*ERROR HANDLER*/
if (config.isDev || config.debug) {
  app.use(errorhandler());
}

app.listen(config.port, function () {
  console.log('Server started!');
});