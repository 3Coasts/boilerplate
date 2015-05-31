var app = require('ampersand-app')
  , View = require('ampersand-view')
  , html = require('./full.html');

module.exports = View.extend({
  template: html,
  bindings: {
    'model.{{titleField}}': { type: 'text', hook: '{{titleField}}' },
    {{#detailFields}}
    'model.{{lowercase}}': { type: 'text', hook: '{{lowercase}}' },
    {{/detailFields}}
    'model.editLink': { type: 'attribute', name: 'href', hook: 'edit' },
    'model.deleteLink': { type: 'attribute', name: 'href', hook: 'delete' },
    'app.me.signedIn': { type: 'toggle', no: 'admin' }
  },
  deleteArticle: function() {
    if (confirm('Are you sure?'))
      this.model.destroy({
        success: function() {
          app.nav('{{name}}');
        }
      });
  }

});