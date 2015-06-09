var app = require('./app')
  , parallel = require('async').parallel
  , extend = require('lodash.assign')
  , omit = require('lodash.omit')
  , filter = require('lodash.filter')
  , has = require('lodash.has')
  , transform = require('lodash.transform')
  , caps = require('lodash.capitalize')

function Handlers(resource, methods) {
  if (!(this instanceof Handlers))
    return new Handlers();

  if (!resource && !resource.name)
    throw new Error('Invalid resource');

  this.resource = resource;
  this.modelName = caps(this.resource.name);
  this.readOnly = this.resource.readOnly || [];
  this.Model = app.models[this.resource.name];

  this.references = function() {
    return filter(this.resource.model.attributes, function(attribute) {
      return has(attribute, 'model');
    });
  }


  this['get' + this.modelName] = this.list.bind(this);
  this['post' + this.modelName] = this.create.bind(this);
  this['get' + this.modelName + 'Slug'] = this.get.bind(this);
  this['put' + this.modelName + 'Slug'] = this.put.bind(this);
  this['delete' + this.modelName + 'Slug'] = this.delete.bind(this);

  extend(this, methods);
}


Handlers.prototype.list = function getEntity(req, res, next) {
  var handlers = this;

  var sort = req.query.sort || { createdAt: 'desc' };
  var limit = req.query.limit || 10;
  var skip = req.query.skip || 0;

  req.query = transform(omit(req.query, 'sort', 'limit', 'skip'), function (result, value, key) {
    result[key] = { contains: value }
  })

  parallel({
    models: function models(cb) {
      var query = handlers.Model.find(req.query).sort(sort).limit(limit).skip(skip);
      if (handlers.resource.model.populate)
        query.populate(handlers.resource.model.populate);
      query.exec(cb)
    },
    count: function count(cb) {
      handlers.Model.count(req.params, cb)
    }
  }, function parallelCb(err, results) {
    if (err) return next(err);

    res.setHeader('count', results.count);
    return res.json(results.models);
  });

};

Handlers.prototype.create = function (req, res, next) {
  this.Model.create(req.body, function (err, model) {
    if (err) return next(err);
    return res.json(model);
  });
};

Handlers.prototype.get = function (req, res) {
  var query = this.Model.findOne({ slug: req.params.slug });

  if (this.resource.model.populate)
    query.populate(this.resource.model.populate);

  query.exec(function queryExecCb(err, model) {
    if (err) return next(err);
    if (!model) return res.sendStatus(404);
    return res.json(model);
  });
};

Handlers.prototype.put = function (req, res, next) {
  var handlers = this
    , Model = handlers.Model;

  Model.update({ slug: req.params.slug }, omit(req.body, handlers.readOnly))
    .exec(function(err) {
      if (err) return next(err);

      var query = Model.findOne({ slug: req.params.slug });

      if (handlers.resource.model.populate)
        query.populate(handlers.resource.model.populate);

      query.catch(next).then(function(model) {
        return res.json(model);
      });
    });

};

Handlers.prototype.delete = function (req, res, next) {
  this.Model.destroy({ slug: req.params.slug }, function(err) {
    if (err) return next(err);
    return res.sendStatus(204);
  })
};


module.exports = Handlers;