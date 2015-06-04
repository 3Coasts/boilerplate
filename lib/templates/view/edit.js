var app = require('ampersand-app')
  , View = require('ampersand-view')
  , html = require('./edit.html');

module.exports = View.extend({
  template: html,

  bindings: {
    {{#each attributes}}
      {{#if inputIsNotVoidElement}}
      'model.{{lowercase}}': { type: 'text', name: 'value', hook: '{{lowercase}}' },
      {{else}}
      'model.{{lowercase}}': { type: 'attribute', name: 'value', hook: '{{lowercase}}' },
      {{/if}}
    {{/each}}
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