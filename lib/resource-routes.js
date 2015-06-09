var app = require('./app')
  , fs = require('fs')
  , capitalize = require('lodash.capitalize')
  , version = require('./config').version
  , Handlers = require('./handlers')
  , passport = require('./passport')
  , resources = require('../Resources.json')
  , routeTemplate = fs.readFileSync(__dirname + '/templates/route.js', {encoding: 'utf8'})


/*RESOURCE ROUTES*/
resources.forEach(eachResource);

// Catch all for api routes
app.get('/api/*', function apiCatchAll(req, res) {
  return res.sendStatus(404);
});

// Catch all non-api should send client html
app.get('/*', function clientRoute(req, res) {
  res.sendFile('index.html', { root: __dirname });
});

function eachResource(resource) {

  if (!resource.routes) return;

  var routesPath = '../routes/' + resource.name + '.js';

  if (!fs.existsSync(__dirname + '/' + routesPath))
    fs.writeFileSync(__dirname + '/' + routesPath, routeTemplate);

  var customHandlers = require(routesPath);
  var handlers = new Handlers(resource, customHandlers);

  resource.routes.forEach(function eachResourceRoute(route) {
    var path = '/api/v' + version + '/' + route.path;
    var handler = handlers[getMethodName(route.method, route.path)];
    var args = [path];

    if (route.protect)
      args.push(passport.authenticate('bearer', {session: false}))

    args.push(handler);

    app[route.method].apply(app, args);
    if (route.method === 'put')
      app['patch'].apply(app, args);

  });

}

function getMethodName(method, path) {
  var name = path.split('/');
  if (!name.length) throw new Error('Bad Route');
  if (name.length === 1) return method + capitalize(name[0]);

  for (var x in name) {
    name[x] = name[x].replace(/\W+/g, '');
    name[x] = capitalize(name[x]);
  }
  return method + name.join('');
}

