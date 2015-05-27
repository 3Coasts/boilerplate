var fs = require('fs')
  , mongoose = require('mongoose')
  , extend = require('lodash.assign')
  , caps = require('lodash.capitalize')
  , config = require('./config')
  , Handlers = require('./handlers')
  , resources = require('../resources.json')
  , Model = require('./model')
  , models = {};

exports.init = init;
exports.models = models;

mongoose.connect("mongodb://" + config.mongo.host + "/" + config.mongo.database, {
  user: config.mongo.user || null,
  pass: config.mongo.pass || null
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

function init (app) {

  /* RESOURCE MODEL*/
  resources.forEach(function (resource) {

    var modelPath = '../models/' + resource.name + '.js';
    if (fs.existsSync(__dirname + '/' + modelPath)) {
      var customModelMethods = require(modelPath);
    } else {
      fs.writeFileSync(__dirname + '/' + modelPath, '//model stub');
    }

    var modelName = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
    var schemaName = modelName + 'Schema';
    var schema = new Model(extend(resource.model, customModelMethods));
    models[schemaName] = schema;
    models[modelName] = mongoose.model(modelName, schema);

  });

  /*RESOURCE ROUTES*/
  var passport = require('./passport');
  resources.forEach(function (resource) {

    var routesPath = '../routes/' + resource.name + '.js';

    if (fs.existsSync(__dirname + '/' + routesPath))
      var customHandlers = require(routesPath);

    var resourceHandlers = new Handlers(resource, customHandlers || {});

    resource.routes.forEach(function (route) {
      var path = '/api/v' + config.version + '/' + route.path;
      var handler = resourceHandlers[getMethodName(route.method, route.path)];

      if (route.protect) {
        app[route.method](path, passport.authenticate('bearer', {session: false}), handler);
        if (route.method === 'put')
          app['patch'](path, passport.authenticate('bearer', {session: false}), handler);
      } else {
        app[route.method](path, handler);
        if (route.method === 'put')
          app['patch'](path, handler);
      }

    });

  });


  // Catch all for api routes
  app.get('/api/*', function (req, res) {
    return res.sendStatus(404);
  });

  // All others send client html
  app.get('/*', function(req, res, next){
    res.sendFile('index.html', {root: __dirname });
  });

}


function getMethodName (method, path) {
  var name = path.split('/');
  if (!name.length) throw new Error('Bad Route');
  if (name.length === 1) {
    return method + caps(name[0]);
  } else {
    for (var x in name) {
      name[x] = name[x].replace(/\W+/g, "");
      name[x] = caps(name[x]);
    }
    return method + name.join('');
  }
}
