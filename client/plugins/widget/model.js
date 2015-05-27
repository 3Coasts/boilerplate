var app = require('ampersand-app')
  , marked = require('marked');

module.exports = app.BaseModel.extend({
  modelType: 'Article',
  urlRoot: '/api/v1/widget',
  idAttribute: 'slug',
  props: {
    slug: 'string',
    name: 'string',
  },
  derived: {
    viewLink: {
      deps: ['slug'],
      fn: function () {
        return '/widget/' + this.slug;
      }
    },
    editLink: {
      deps: ['slug'],
      fn: function () {
        return '/widget/' + this.slug + '/edit';
      }
    },
    deleteLink: {
      deps: ['slug'],
      fn: function () {
        return '/widget/' + this.slug + '/delete';
      }
    }
  }
});