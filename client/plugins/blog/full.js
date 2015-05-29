var app = require('ampersand-app')
  , View = require('ampersand-view')
  , html = require('./full.html');

module.exports = View.extend({
  template: html,
  bindings: {
    'model.title': { type: 'text', hook: 'title' },
    'model.author.name': { type: 'text', hook: 'author' },
    'model.bodyParsed': { type: 'innerHTML', hook: 'body' },
    'model.editLink': { type: 'attribute', name: 'href', hook: 'edit' },
    'model.deleteLink': { type: 'attribute', name: 'href', hook: 'delete' },
    'app.me.signedIn': { type: 'toggle', no: 'admin' }
  },
  deleteArticle: function() {
    if (confirm('Are you sure?'))
      this.model.destroy({
        success: function() {
          app.nav('blog');
        }
      });
  }

});