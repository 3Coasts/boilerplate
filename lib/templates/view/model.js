var Model = require('../../models/base-model')
  , marked = require('marked');

module.exports = Model.extend({
  modelType: '{{nameCapitalized}}',
  urlRoot: '/api/v1/{{name}}',
  props: {
    id: 'number',
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
      deps: ['id'],
      fn: function() {
        return '/{{name}}/' + this.id;
      }
    },
    editLink: {
      deps: ['id'],
      fn: function() {
        return '/{{name}}/' + this.id + '/edit';
      }
    },
    deleteLink: {
      deps: ['id'],
      fn: function() {
        return '/{{name}}/' + this.id + '/delete';
      }
    }
  }
});