var fs = require('fs')
  , parallel = require('async').parallel
  , camelCase = require('lodash.camelcase')
  , extend = require('lodash.assign')
  , omit = require('lodash.omit')
  , caps = require('lodash.capitalize')
  , config = require('./config')
  , passport = require('./passport')
  , resources = require('../resources.json')
  , models = require('./models');

module.exports = function (app) {

  resources.forEach(function (resource) {

    var path = '../routes/' + resource.name + '.js';

    var resourceHandlers = {};

    if (fs.existsSync(__dirname + '/' + path)) {
      resourceHandlers = require(path);
    }

    resourceHandlers = new Handlers(resource.name, resourceHandlers);

    resource.routes.forEach(function (route) {

      var path = '/api/v' + config.version + '/' + route.path;

      var getMethodName = function () {
        var name = route.path.split('/');
        if (!name.length) throw new Error('Bad Route');
        if (name.length === 1) {
          return route.method + caps(name[0]);
        } else {
          for (var x in name) {
            name[x] = name[x].replace(/\W+/g, "");
            name[x] = caps(name[x]);
          }
          return route.method + name.join('');
        }
      };

      var handler = resourceHandlers[getMethodName()];

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
    res.render('index')
  });

};



function Handlers (type, methods) {
  var handlers = this;
  if (!(handlers instanceof Handlers))
    return new Handlers();

  if (!type)
    throw new Error('type is required');

  handlers.modelName = caps(type);
  handlers.readOnly = handlers.readOnly || [];

  var getEntity = function (req, res, next) {

    var sort = req.query.sort || 'field -createdAt';
    var limit = req.query.limit || 10;
    var skip = req.query.skip || 0;
    var query = models[handlers.modelName].find(extend({type: handlers.type}, req.params));

    parallel({
      docs: function (cb) {
        query.sort(sort).limit(limit).skip(skip).exec(cb);
      },
      count: function (cb) {
        query.count(cb);
      }
    }, function (err, results) {
      if (err) return next(err);

      res.setHeader('count', results.count);
      return res.json(results.docs);
    });


  };

  var postEntity = function (req, res, next) {
    var doc = new models[handlers.modelName](req.body);
    doc.save(function (err, doc) {
      if (err) return next(err);
      return res.json(doc);
    });
  };

  var getEntityId = function (req, res) {
    models[handlers.modelName].findOne({ slug: req.params.id }, function (err, doc) {
      if (err) return next(err);
      return res.json(doc);
    });
  };

  var putEntityId = function (req, res, next) {
    models[handlers.modelName].findOne({ slug: req.params.id }, function (err, doc) {
      if (err) return next(err);
      doc = extend(doc, omit(req.body, handlers.readOnly));
      doc.save(function (err, doc) {
        if (err) return next(err);
        return res.json(doc);
      });
    });
  };

  var deleteEntityId = function (req, res, next) {
    models[handlers.modelName].findOne({ slug: req.params.id }, function (err, doc) {
      if (err) return next(err);
      doc.remove(function (err) {
        if (err) return next(err);
        return res.sendStatus(204);
      })
    })
  };

  handlers['get' + handlers.modelName] = getEntity;
  handlers['post' + handlers.modelName] = postEntity;
  handlers['get' + handlers.modelName + 'Id'] = getEntityId;
  handlers['put' + handlers.modelName + 'Id'] = putEntityId;
  handlers['delete' + handlers.modelName + 'Id'] = deleteEntityId;

  extend(handlers, methods);

}
