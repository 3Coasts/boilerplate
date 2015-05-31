var fs = require('fs')
  , mongoose = require('mongoose')
  , Mustache = require('mustache')
  , extend = require('lodash.assign')
  , caps = require('lodash.capitalize')
  , toArray = require('lodash.toarray')
  , mapValues = require('lodash.mapvalues')
  , find = require('lodash.find')
  , reject = require('lodash.reject')
  , vprintf = require('sprintf-js').vsprintf
  , config = require('./config')
  , Handlers = require('./handlers')
  , resources = require('../resources.json')
  , Model = require('./model')
  , models = {}

exports.init = init;
exports.models = models;

var host = vprintf('mongodb://%s/%s', [config.mongo.host, config.mongo.database]);
mongoose.connect(host, {
  user: config.mongo.user || null,
  pass: config.mongo.pass || null
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

function init(app) {

  /* RESOURCE VIEW*/
  resources.forEach(function eachResource(resource) {
    if (!resource.view) return
    var clientViewPath = __dirname + '/../client/plugins/' + resource.name + '/'
    var templatePath = __dirname + '/templates/view/'
    if (fs.existsSync(clientViewPath)) return
    fs.mkdirSync(clientViewPath)

    var props = reject(mapValues(resource.model.props, function(value, key) {
      return {
        lowercase: key.toLowerCase(),
        capitalized: caps(key),
        type: value.type
      }
    }), { type: 'ref' });

    function returnProps(fields) {
      var toReturn = [];
      for(var x in fields)
        toReturn.push(find(props, { lowercase: fields[x] }));
      return toReturn;
    }

    var config = {
      name: resource.name,
      nameCapitalized: caps(resource.name),
      nameAllCaps: resource.name.toUpperCase(),
      titleField: resource.view.titleField,
      teaserFields: returnProps(resource.view.teaserFields),
      detailFields: returnProps(resource.view.detailFields),
      props: props
    };
    var templateFiles = fs.readdirSync(templatePath)
    templateFiles.forEach(function(file) {
      var template = fs.readFileSync(templatePath + file, { encoding: 'utf8' })
      try {
        var output = Mustache.render(template, config);
      } catch (err) {
        console.log(err);
      }
      fs.writeFileSync(clientViewPath + file, output);
    });
  });

  /* RESOURCE MODEL*/
  resources.forEach(function eachResource(resource) {

    var modelPath = '../models/' + resource.name + '.js';
    if (fs.existsSync(__dirname + '/' + modelPath))
      var customModelMethods = require(modelPath);
    else
      fs.writeFileSync(__dirname + '/' + modelPath, '//model stub');

    var modelName = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
    var schemaName = modelName + 'Schema';
    var schema = new Model(extend(resource.model, customModelMethods));
    models[schemaName] = schema;
    models[modelName] = mongoose.model(modelName, schema);

  });

  /*RESOURCE ROUTES*/
  var passport = require('./passport');
  resources.forEach(function eachResource(resource) {

    var routesPath = '../routes/' + resource.name + '.js';

    if (fs.existsSync(__dirname + '/' + routesPath))
      var customHandlers = require(routesPath);

    var resourceHandlers = new Handlers(resource, customHandlers || {});

    resource.routes.forEach(function eachResourceRoute(route) {
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
  app.get('/api/*', function apiCatchAll(req, res) {
    return res.sendStatus(404);
  });

  // All others send client html
  app.get('/*', function clientRoute(req, res) {
    res.sendFile('index.html', {root: __dirname });
  });

}


function getMethodName(method, path) {
  var name = path.split('/');
  if (!name.length) throw new Error('Bad Route');
  if (name.length === 1) return method + caps(name[0]);

  for (var x in name) {
    name[x] = name[x].replace(/\W+/g, '');
    name[x] = caps(name[x]);
  }
  return method + name.join('');
}

