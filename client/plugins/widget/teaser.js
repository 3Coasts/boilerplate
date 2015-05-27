var View = require('ampersand-view')
  , html = require('./teaser.html');

module.exports = View.extend({
  template: html,
  bindings: {
    'model.name': { type: 'text', hook: 'name' },
    'model.viewLink': [
      { type: 'attribute', name: 'href', hook: 'name' },
      { type: 'attribute', name: 'href', hook: 'read-more' }
    ]
  }
});