var app = require('ampersand-app')
  , View = require('ampersand-view')
  , html = require('./edit.html');

module.exports = View.extend({
  template: html,

  bindings: {
    'model.name': { type: 'attribute', name: 'value', hook: 'name' }
  },

  events: {
    'blur [data-hook=name]': 'nameChange',
    'submit form': 'submitForm'
  },

  nameChange: function(e) {
    this.model.name = e.target.value;
  },

  submitForm: function(e) {
    e.preventDefault();
    var isNew = this.model.isNew();
    this.model.save(null, {
      success: function(model) {
        app.msg(isNew ? 'WIDGET_CREATED' : 'WIDGET_UPDATED');
        app.nav(model.viewLink);
      }
    });
  }

});