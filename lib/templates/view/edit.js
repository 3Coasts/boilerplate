var app = require('ampersand-app')
  , View = require('ampersand-view')
  , html = require('./edit.html');

module.exports = View.extend({
  template: html,

  bindings: {
    {{#attributes}}
    'model.{{lowercase}}': { type: 'attribute', name: 'value', hook: '{{lowercase}}' },
    {{/attributes}}
  },

  events: {
    {{#attributes}}
    'blur [data-hook={{lowercase}}]': '{{lowercase}}Change',
    {{/attributes}}
    'submit form': 'submitForm'
  },

  {{#attributes}}
  {{lowercase}}Change: function(e) {
    this.model.{{lowercase}} = e.target.value;
  },
  {{/attributes}}

  submitForm: function(e) {
    e.preventDefault();
    var isNew = this.model.isNew();
    this.model.save(null, {
      success: function(model) {
        app.msg(isNew ? '{{nameAllCaps}}_CREATED' : '{{nameAllCaps}}_UPDATED');
        app.nav(model.viewLink);
      }
    });
  }

});