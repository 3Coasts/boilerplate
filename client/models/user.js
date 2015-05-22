var Model = require('./base-model')

module.exports = Model.extend({
  modelType: 'User',
  urlRoot: '/api/v1/user',
  idAttribute: '_id',
  props: {
    _id: 'string',
    name: 'string',
    phone: 'string'
  }
});