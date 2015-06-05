var Model = require('./base-model');

module.exports = Model.extend({
  modelType: 'User',
  urlRoot: '/api/v1/user',
  props: {
    id: 'string',
    name: 'string',
    phone: 'string'
  }
});