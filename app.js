var express = require('express'),
  config = require('./bin/config'),
  app = express(),
  http = require('http').Server(app),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  SessionStore = require('connect-redis')(session),
  redis = require('./bin/redis'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  logger = require('./bin/logger'),
  fixPath = require('./bin/fix-path'),
  compression = require('compression'),
  errorhandler = require('errorhandler');

/*APP CONFIG*/
app.set('environment', config.isDev ? 'development' : 'production');
app.disable('x-powered-by');
app.use(express.static(fixPath('public'), { maxAge: !config.isDev ? 31557600000 : 0 }));
if (!config.isDev) { app.use(compression()); }
app.use(session({ secret: config.secret, store: new SessionStore({ client: redis }), saveUninitialized: true, resave: true, cookie: { httpOnly: false } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger);

require('./bin/passport-config.js')(passport, LocalStrategy);

/*HTTP ROUTES*/
require('./routes').forEach(function addRouteItem(item) {
  app[item.method].apply(app, [item.path].concat(item.callbacks));
  if (item.method === 'put') {
    app['patch'].apply(app, [item.path].concat(item.callbacks));
  }
});

app.get('/api/*', function (req, res) {
  return res.sendStatus(404);
});

/*ERROR HANDLER*/
if (config.isDev || config.debug) {
  app.use(errorhandler());
}

http.listen(config.port, function startServerCallback() {
  console.log('Server started!');
});