var parallel = require('async').parallel
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
  this.Model = require('./resources').models[this.modelName];

  this['get' + this.modelName] = this.getEntity.bind(this);
  this['post' + this.modelName] = this.postEntity.bind(this);
  this['get' + this.modelName + 'Id'] = this.getEntityId.bind(this);
  this['put' + this.modelName + 'Id'] = this.putEntityId.bind(this);
  this['delete' + this.modelName + 'Id'] = this.deleteEntityId.bind(this);

  extend(this, methods);
}


Handlers.prototype.getEntity = function getEntity(req, res, next) {
  var handlers = this;

  var sort = req.query.sort || 'field -createdAt';
  var limit = req.query.limit || 10;
  var skip = req.query.skip || 0;
  var query = this.Model.find(extend({type: handlers.type}, req.params));

  if (this.resource.model && this.resource.model.populate)
    query.populate(this.resource.model.populate);

  parallel({
    docs: function docs(cb) {
      query.sort(sort).limit(limit).skip(skip).exec(cb);
    },
    count: function count(cb) {
      query.count(cb);
    }
  }, function parallelCb(err, results) {
    if (err) return next(err);

    res.setHeader('count', results.count);
    return res.json(results.docs);
  });

};

Handlers.prototype.postEntity = function postEntity(req, res, next) {
  var handlers = this;
  var doc = new this.Model(req.body);
  doc.save(function docSaveCb(err, doc) {
    if (err) return next(err);
    handlers.populate(doc, function populateCb(err, doc) {
      if (err) return next(err);
      return res.json(doc);
    });
  });
};

Handlers.prototype.getEntityId = function getEntityId(req, res) {
  var query = this.Model.findOne({ slug: req.params.id });

  if (this.resource.model && this.resource.model.populate)
    query.populate(this.resource.model.populate);

  query.exec(function queryExecCb(err, doc) {
    if (err) return next(err);
    return res.json(doc);
  });
};

Handlers.prototype.putEntityId = function putEntityId(req, res, next) {
  var handlers = this;
  this.Model.findOne({ slug: req.params.id }, function findOneCb(err, doc) {
    if (err) return next(err);
    doc = extend(doc, omit(req.body, handlers.readOnly));
    doc.save(function docSaveCb(err, doc) {
      if (err) return next(err);
      handlers.populate(doc, function(err, doc) {
        if (err) return next(err);
        return res.json(doc);
      });
    });
  });
};

Handlers.prototype.deleteEntityId = function deleteEntityId(req, res, next) {
  this.Model.findOne({ slug: req.params.id }, function findOneCb(err, doc) {
    if (err) return next(err);
    doc.remove(function docRemoveCb(err) {
      if (err) return next(err);
      return res.sendStatus(204);
    })
  })
};


Handlers.prototype.populate = function populate(doc, cb) {
  var populate = this.resource.model.populate;
  if (!populate)
    return cb(null, doc);
  this.Model.populate(doc, { path: populate }, cb);
};

module.exports = Handlers;