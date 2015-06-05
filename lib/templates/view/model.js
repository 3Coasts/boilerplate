var Model = require('../../models/base-model')
  , marked = require('marked');

module.exports = Model.extend({
  modelType: '{{nameCapitalized}}',
  urlRoot: '/api/v1/{{name}}',
  idAttribute: 'slug',
  props: {
    slug: 'string',
    {{#attributes}}
    {{#unless model}}
    {{lowercase}}: '{{type}}',
    {{/unless}}
    {{/attributes}}
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