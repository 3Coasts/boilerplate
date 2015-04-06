var Model = require('ampersand-model');

module.exports = Model.extend({
  modelType: 'User',
  props: {
    firstName: 'string',
    lastName: 'string',
    email: 'string'
  },
  derived: {
    fullName: {
      deps: ['firstName','lastName'],
      fn: function () {
        return [this.firstName,this.lastName].join(' ');
      }
    }
  }
});