var Collection = require('ampersand-rest-collection')
  , User = require('./user');

module.exports = Collection.extend({
  urlRoot: '/api/v1/user',
  model: User
});