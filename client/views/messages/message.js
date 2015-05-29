'use strict';

var View = require('ampersand-view')
  , html = require('./message.html');

module.exports = View.extend({
  template: html,
  bindings: {
    'model.message': { type: 'text', hook: 'text' },
    'model.typeClass': { type: 'class' }
  },
  events: {
    click: 'closeFlash'
  },
  initialize: function() {
    var view = this;
    setTimeout(function() {
      view.collection.remove(view.model);
    }, 10000);
  },
  closeFlash: function() {
    this.collection.remove(this.model);
  }
});


