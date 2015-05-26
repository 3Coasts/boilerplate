var mongoose = exports.mongoose = require('mongoose')
  , slug = require('mongoose-url-slugs')
  , isFunction = require('lodash.isfunction')
  , omit = require('lodash.omit')
  , extend = require('lodash.assign');

function Model (opts) {
  if (!(this instanceof Model))
    return new Model(opts);

  var model = this;

  model.props = extend({
    createdAt: { type: Date },
    updatedAt: { type: Date }
  }, opts.props || {});

  model.schema = new mongoose.Schema(model.props);

  model.schema.pre('save', model._preSave);

  model.schema.method('toJSON', function() {
    var obj = this.toObject();
    return omit(obj, this.hidden || []);
  });

  if (opts.statics) {
    Object.keys(opts.statics).forEach(function (key) {
      model.schema.static(key, opts.statics[key]);
    });
  }

  if (opts.instanceMethods) {
    Object.keys(opts.instanceMethods).forEach(function (key) {
      model.schema.method(key, opts.instanceMethods[key]);
    });
  }

  model.schema.plugin(slug(opts.slug || '_id'));

  return this.schema;
}

Model.prototype._preSave = function(next) {
  var obj = this;
  obj.updatedAt = new Date();
  if (!obj.createdAt) obj.createdAt = new Date();
  if (!isFunction(this.preSave)) return next();
  this.preSave(next);
};


module.exports = Model;