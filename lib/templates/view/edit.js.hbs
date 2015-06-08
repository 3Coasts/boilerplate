var app = require('ampersand-app')
  , View = require('ampersand-view')
  , SearchView = require('../../views/search/search')
  , html = require('./edit.html')
  {{#attributes}}
  {{#if model}}
  , {{model.capitalized}}Collection = require('../{{model.name}}/collection')
  {{/if}}
  {{/attributes}}
;

module.exports = View.extend({
  template: html,

  bindings: {
    {{#each attributes}}
    {{#unlessAnd remove model}}
    {{#if inputIsNotVoidElement}}
    'model.{{lowercase}}': { type: 'text', name: 'value', hook: '{{lowercase}}' },
    {{else}}
    'model.{{lowercase}}': { type: 'attribute', name: 'value', hook: '{{lowercase}}' },
    {{/if}}
    {{/unlessAnd}}
    {{/each}}
    operation: { type: 'text', hook: 'operation' }
  },

  props: {
    operation: { type: 'string', default: 'New' }
  },

  events: {
    {{#attributes}}
    {{#unlessAnd remove model}}
    'blur [data-hook={{lowercase}}]': '{{lowercase}}Change',
    {{/unlessAnd}}
    {{/attributes}}
    'submit form': 'submitForm'
  },

  render: function() {
    var view = this;
    view.renderWithTemplate();
    {{#attributes}}
    {{#if model}}

    view.{{lowercase}} = new SearchView({
      collection: new {{model.capitalized}}Collection(),
      label: '{{capitalized}}',
      property: '{{model.title}}',
      model: view.model.{{lowercase}}
    })

    view.{{lowercase}}.on('change:model', function (subview) {
      view.model.{{lowercase}} = subview.model;
    });

    view.renderSubview(view.{{lowercase}}, view.queryByHook('{{id}}'))


    {{/if}}
    {{/attributes}}
  },

  {{#attributes}}
  {{#unlessAnd remove model}}
  {{lowercase}}Change: function(e) {
    this.model.{{lowercase}} = e.target.value;
  },
  {{/unlessAnd}}
  {{/attributes}}

  initialize: function () {
    this.operation = this.model.isNew() ? 'New' : 'Edit'
  },

  submitForm: function(e) {
    e.preventDefault();
    var isNew = this.model.isNew();
    this.model.save();
    this.model.on('sync', function(model) {
      app.msg(isNew ? '{{nameAllCaps}}_CREATED' : '{{nameAllCaps}}_UPDATED');
      app.nav(model.viewLink);
    });
  }
})