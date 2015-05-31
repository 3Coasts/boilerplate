var Model = require('../../models/base-model')
  , marked = require('marked');

module.exports = Model.extend({
  modelType: '{{nameCapitalized}}',
  urlRoot: '/api/v1/{{name}}',
  idAttribute: 'slug',
  props: {
    slug: 'string',
    {{#props}}
    {{lowercase}}: '{{type}}',
    {{/props}}
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