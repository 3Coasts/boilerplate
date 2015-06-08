var Model = require('../../models/base-model')
  , isString = require('lodash.isstring')
  , marked = require('marked');

module.exports = Model.extend({
  modelType: '{{nameCapitalized}}',
  urlRoot: '/api/v1/{{name}}',
  idAttribute: 'slug',
  props: {
    id: 'string',
    slug: 'string',
    {{#attributes}}
    {{#unless model}}
    {{lowercase}}: '{{type}}',
    {{/unless}}
    {{/attributes}}
  },
  parse: function (attrs) {
    if (!isString(attrs.id))
      attrs.id = String(attrs.id);
    return attrs;
  },
  children: {
    {{#attributes}}
    {{#if model}}
    {{lowercase}}: require('../{{model.name}}/model'),
    {{/if}}
    {{/attributes}}
  },
  derived: {
    viewLink: {
      deps: ['slug'],
      fn: function() {
        return '/{{name}}/' + this.slug;
      }
    },
    editLink: {
      deps: ['slug'],
      fn: function() {
        return '/{{name}}/' + this.slug + '/edit';
      }
    },
    deleteLink: {
      deps: ['slug'],
      fn: function() {
        return '/{{name}}/' + this.slug + '/delete';
      }
    }
  }
});