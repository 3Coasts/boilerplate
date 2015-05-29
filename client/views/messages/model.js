'use strict';

var Model = require('ampersand-state');

module.exports = Model.extend({
  modelType: 'Message',
  props: {
    type: { type: 'string' },
    message: { type: 'string' }
  },
  derived: {
    typeClass: {
      deps: ['type'],
      fn: function() {
        if (this.type === 'error') return 'message-error';
        if (this.type === 'warning') return 'message-alert';
        if (this.type === 'info') return 'message-success';
      }
    }
  }
});