var Waterline = require('waterline')
  , isFunction = require('lodash.isfunction')
  , extend = require('lodash.assign')
  , where = require('lodash.findwhere')
  , clone = require('lodash.clone')
  , omit = require('lodash.omit')

module.exports = function model(resource, overrides) {
  var opts = {}

  opts.tableName = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
  opts.connection = 'disk'

  var attributes = clone(resource.model.attributes, true);
  for (var x in attributes) {
    delete attributes[x].remove;
    delete attributes[x].inputElement;
    delete attributes[x].inputElementAttributes;
  }

  opts.attributes = extend(attributes, overrides.instanceMethods || {});

  opts.attributes.toJSON = function toJSON() {
    var obj = this.toObject();
    var attributes = resource.model.attributes;
    for (var x in attributes)
      if (attributes[x].remove) delete obj[x];
    return obj;
  }

  extend(opts, overrides.classMethods || {});

  return Waterline.Collection.extend(opts);
}
