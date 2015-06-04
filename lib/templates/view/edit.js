var app = require('ampersand-app')
  , View = require('ampersand-view')
  , html = require('./edit.html');

module.exports = View.extend({
  template: html,

  bindings: {
    {{#each attributes}}
    {{#unless remove}}
    {{#if inputIsNotVoidElement}}
    'model.{{lowercase}}': { type: 'text', name: 'value', hook: '{{lowercase}}' },
    {{else}}
    'model.{{lowercase}}': { type: 'attribute', name: 'value', hook: '{{lowercase}}' },
    {{/if}}
    {{/unless}}
    {{/each}}
  },

  events: {
    {{#attributes}}
    {{#unless remove}}
    'blur [data-hook={{lowercase}}]': '{{lowercase}}Change',
    {{/unless}}
    {{/attributes}}
    'submit form': 'submitForm'
  },

  {{#attributes}}
  {{#unless remove}}
  {{lowercase}}Change: function(e) {
    this.model.{{lowercase}} = e.target.value;
  },
  {{/unless}}
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