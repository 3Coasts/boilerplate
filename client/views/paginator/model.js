var Model = require('ampersand-model');

module.exports = Model.extend({
  props: {
    number: { type: 'number' },
    current: { type: 'boolean' }
  }
});