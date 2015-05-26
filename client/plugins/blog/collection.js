var Collection = require('ampersand-rest-collection')
  , Article = require('./model');

module.exports = Collection.extend({
  url: '/api/v1/article',
  model: Article
});