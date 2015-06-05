var app = require('./app')
  , parallel = require('async').parallel
  , extend = require('lodash.assign')
  , omit = require('lodash.omit')
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

  this['get' + this.modelName] = this.getEntity.bind(this);
  this['post' + this.modelName] = this.postEntity.bind(this);
  this['get' + this.modelName + 'Id'] = this.getEntityId.bind(this);
  this['put' + this.modelName + 'Id'] = this.putEntityId.bind(this);
  this['delete' + this.modelName + 'Id'] = this.deleteEntityId.bind(this);

  extend(this, methods);
}


Handlers.prototype.getEntity = function getEntity(req, res, next) {
  var handlers = this;

  var sort = req.query.sort || { createdAt: 'desc' };
  var limit = req.query.limit || 10;
  var skip = req.query.skip || 0;

  parallel({
    models: function models(cb) {
      var query = handlers.Model.find(req.params).sort(sort).limit(limit).skip(skip);
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

Handlers.prototype.postEntity = function postEntity(req, res, next) {
  var handlers = this;
  this.Model.create(req.body, function(err, model) {
    if (err) return next(err);
    return res.json(model);
  });
};

Handlers.prototype.getEntityId = function getEntityId(req, res) {
  var query = this.Model.findOne({ id: req.params.id });

  if (this.resource.model.populate)
    query.populate(this.resource.model.populate);

  query.exec(function queryExecCb(err, model) {
    if (err) return next(err);
    if (!model) return res.sendStatus(404);
    return res.json(model);
  });
};

Handlers.prototype.putEntityId = function putEntityId(req, res, next) {
  var handlers = this
    , Model = handlers.Model;

  Model.update(req.params.id, omit(req.body, handlers.readOnly))
    .exec(function() {
      var query = Model.findOne({ id: req.params.id });

      if (handlers.resource.model.populate)
        query.populate(handlers.resource.model.populate);

      query.catch(next).then(function(model) {
        return res.json(model);
      });
    });

};

Handlers.prototype.deleteEntityId = function deleteEntityId(req, res, next) {
  this.Model.destroy({ id: req.params.id }, function findOneCb(err) {
    if (err) return next(err);
    return res.sendStatus(204);
  })
};


module.exports = Handlers;