var Waterline = require('waterline')
  , getSlug = require('speakingurl')
  , uuid = require('uuid').v4
  , isFunction = require('lodash.isfunction')
  , extend = require('lodash.assign')
  , where = require('lodash.findwhere')
  , clone = require('lodash.clone')
  , omit = require('lodash.omit')
  , config = require('./config')

module.exports = Model

function Model(resource, overrides) {
  var model = this;

  model.slug = resource.model.slug;

  var opts = {}

  opts.tableName = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
  model.type = opts.tableName.toLowerCase();
  opts.connection = config.databases.default;

  var attributes = clone(resource.model.attributes, true);
  for (var x in attributes) {
    delete attributes[x].remove;
    delete attributes[x].inputElement;
    delete attributes[x].inputElementAttributes;
  }

  opts.attributes = extend(attributes, overrides.instanceMethods || {});

  opts.attributes.slug = {
    type: 'string',
    unique: true,
    required: true,
    defaultsTo: function() {
      return getSlug(this[model.slug]);
    }
  };

  opts.attributes.toJSON = function toJSON() {
    var obj = this.toObject();
    var attributes = resource.model.attributes;
    for (var x in attributes)
      if (attributes[x].remove) delete obj[x];
    return obj;
  }

  overrides.hooks = overrides.hooks || {}

  if (overrides.hooks.beforeCreate)
    overrides.hooks.beforeCreate = model._beforeCreate(overrides.hooks.beforeCreate).bind(model);
  else
    overrides.hooks.beforeCreate = model._beforeCreate().bind(model);

  extend(opts, overrides.classMethods || {});
  extend(opts, overrides.hooks || {});

  model.Model = Waterline.Collection.extend(opts);

}

Model.prototype._beforeCreate = function(beforeCreate) {
  var model = this;
  return function(values, cb) {
    if (beforeCreate)
      beforeCreate(values, finish)
    else
      finish()

    function finish(err) {
      if (err) return cb(err);
      var models = require('../lib/app').models
      models[model.type].find({ slug: values.slug })
        .catch(cb)
        .then(function(models) {
          if (!models.length) return cb()
          values.slug += '-' + (models.length + 1);
          cb();
        });
    }
  }
}
