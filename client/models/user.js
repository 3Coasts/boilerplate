var Model = require('./base-model');

module.exports = Model.extend({
  modelType: 'User',
  urlRoot: '/api/v1/user',
  idAttribute: 'slug',
  props: {
    slug: 'string',
    name: 'string',
    phone: 'string'
  }
});