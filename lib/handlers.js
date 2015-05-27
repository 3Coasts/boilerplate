var parallel = require('async').parallel
  , extend = require('lodash.assign')
  , omit = require('lodash.omit')
  , caps = require('lodash.capitalize');

function Handlers (type, methods) {
  if (!(this instanceof Handlers))
    return new Handlers();

  if (!type)
    throw new Error('type is required');

  this.modelName = caps(type);
  this.readOnly = this.readOnly || [];
  this.Model = require('./resources').models[this.modelName];

  this['get' + this.modelName] = this.getEntity.bind(this);
  this['post' + this.modelName] = this.postEntity.bind(this);
  this['get' + this.modelName + 'Id'] = this.getEntityId.bind(this);
  this['put' + this.modelName + 'Id'] = this.putEntityId.bind(this);
  this['delete' + this.modelName + 'Id'] = this.deleteEntityId.bind(this);

  extend(this, methods);
}


Handlers.prototype.getEntity = function (req, res, next) {
  var handlers = this;

  var sort = req.query.sort || 'field -createdAt';
  var limit = req.query.limit || 10;
  var skip = req.query.skip || 0;
  var query = this.Model.find(extend({type: handlers.type}, req.params));

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

Handlers.prototype.postEntity = function (req, res, next) {
  var doc = new this.Model(req.body);
  doc.save(function (err, doc) {
    if (err) return next(err);
    return res.json(doc);
  });
};

Handlers.prototype.getEntityId = function (req, res) {
  this.Model.findOne({ slug: req.params.id }, function (err, doc) {
    if (err) return next(err);
    return res.json(doc);
  });
};

Handlers.prototype.putEntityId = function (req, res, next) {
  var handlers = this;
  this.Model.findOne({ slug: req.params.id }, function (err, doc) {
    if (err) return next(err);
    doc = extend(doc, omit(req.body, handlers.readOnly));
    doc.save(function (err, doc) {
      if (err) return next(err);
      return res.json(doc);
    });
  });
};

Handlers.prototype.deleteEntityId = function (req, res, next) {
  this.Model.findOne({ slug: req.params.id }, function (err, doc) {
    if (err) return next(err);
    doc.remove(function (err) {
      if (err) return next(err);
      return res.sendStatus(204);
    })
  })
};

module.exports = Handlers;