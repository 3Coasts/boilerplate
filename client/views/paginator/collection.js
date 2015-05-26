var Collection = require('ampersand-collection')
  , Model = require('./model');

module.exports = Collection.extend({
  model: Model
});
