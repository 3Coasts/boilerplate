var Collection = require('ampersand-rest-collection')
  , Model = require('./model');

module.exports = Collection.extend({
  url: '/api/v1/{{name}}',
  model: Model
});