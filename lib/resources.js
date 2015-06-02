var fs = require('fs')
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
  , Model = require('./model')
  , models = {}

exports.init = init;

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function init(app) {

  var resources = require('../resources.json');

  /* RESOURCE VIEW*/
  resources.forEach(function eachResource(resource) {
    if (!resource.view) return
    var clientViewPath = __dirname + '/../client/plugins/' + resource.name + '/'
    var templatePath = __dirname + '/templates/view/'
    deleteFolderRecursive(clientViewPath);
    if (fs.existsSync(clientViewPath)) return
    fs.mkdirSync(clientViewPath)

    var attributes = toArray(mapValues(resource.model.attributes, function(value, key) {
      return {
        lowercase: key.toLowerCase(),
        capitalized: caps(key),
        type: value.type
      }
    }));

    function returnAttributes(fields) {
      var toReturn = [];
      for(var x in fields)
        toReturn.push(find(attributes, { lowercase: fields[x] }));
      return toReturn;
    }

    var config = {
      name: resource.name,
      nameCapitalized: caps(resource.name),
      nameAllCaps: resource.name.toUpperCase(),
      titleField: resource.view.titleField,
      teaserFields: returnAttributes(resource.view.teaserFields),
      detailFields: returnAttributes(resource.view.detailFields),
      attributes: attributes
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

  /*RESOURCE ROUTES*/
  var passport = require('./passport');
  resources.forEach(function eachResource(resource) {

    var routesPath = '../routes/' + resource.name + '.js';

    if (fs.existsSync(__dirname + '/' + routesPath))
      var customHandlers = require(routesPath);

    var resourceHandlers = new Handlers(app, resource, customHandlers || {});

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

