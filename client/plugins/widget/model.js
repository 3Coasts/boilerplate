var app = require('ampersand-app')
  , marked = require('marked');

module.exports = app.BaseModel.extend({
  modelType: 'Article',
  urlRoot: '/api/v1/article',
  idAttribute: 'slug',
  props: {
    slug: 'string',
    title: 'string',
    summary: { type: 'string', default: '' },
    body: { type: 'string', default: '' }
  },
  derived: {
    viewLink: {
      deps: ['slug'],
      fn: function () {
        return '/blog/' + this.slug;
      }
    },
    editLink: {
      deps: ['slug'],
      fn: function () {
        return '/blog/' + this.slug + '/edit';
      }
    },
    deleteLink: {
      deps: ['slug'],
      fn: function () {
        return '/blog/' + this.slug + '/delete';
      }
    },
    bodyParsed: {
      deps: ['body'],
      fn: function () {
        return marked(this.body);
      }
    }
  }
});