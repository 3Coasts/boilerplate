var mongoose = exports.mongoose = require('mongoose')
  , slug = require('mongoose-url-slugs')
  , caps = require('lodash.capitalize')
  , isFunction = require('lodash.isfunction')
  , each = require('lodash.foreach')
  , extend = require('lodash.assign')

module.exports = Model;

function Model(opts) {
  if (!(this instanceof Model))
    return new Model(opts);

  var model = this;

  each(opts.props, function eachProp(prop, index) {
    opts.props[index] = returnProp(opts.props[index]);
  })

  model.props = extend({
    createdAt: { type: Date },
    updatedAt: { type: Date }
  }, opts.props || {});

  model.schema = new mongoose.Schema(model.props);

  model.schema.pre('save', model._preSave);


  if (opts.statics)
    Object.keys(opts.statics).forEach(function eachStaticKey(key) {
      model.schema.static(key, opts.statics[key]);
    });

  if (opts.instanceMethods) {
    var instanceMethodsKeys = Object.keys(opts.instanceMethods);
    instanceMethodsKeys.forEach(function eachInstanceMethodKey(key) {
      model.schema.method(key, opts.instanceMethods[key]);
    });
  }

  opts.slug.split(' ').forEach(function eachSlugProp(prop) {
    if (!opts.props[prop])
      throw new Error('Invalid slug definition');
    if (!opts.props[prop].required)
      throw new Error('Props used as slugs must be required.')
  });

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


function returnProp(prop) {
  if (!prop.type)
    throw new Error('Type not defined');

  var types = {
    date: function() { return Date; },
    string: function() { return String; },
    buffer: function() { return Buffer; },
    boolean: function() { return Boolean; },
    number: function() { return Number; },
    mixed: function() { return mongoose.Schema.Types.Mixed; },
    array: function() { return Array; },
    ref: function() { return mongoose.Schema.ObjectId; }
  };

  if (!isFunction(types[prop.type]))
    throw new Error('Type not valid')

  prop.type = types[prop.type]();

  if (prop.ref)
    prop.ref = caps(prop.ref);

  return prop;

}
