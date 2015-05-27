var View = require('ampersand-view')
  , html = require('./teaser.html');

module.exports = View.extend({
  template: html,
  bindings: {
    'model.title': { type: 'text', hook: 'title' },
    'model.summary': { type: 'text', hook: 'summary' },
    'model.author.name': { type: 'text', hook: 'author' },
    'model.viewLink': [
      { type: 'attribute', name: 'href', hook: 'title' },
      { type: 'attribute', name: 'href', hook: 'read-more' }
    ]
  }
});