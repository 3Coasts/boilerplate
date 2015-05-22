var View = require('ampersand-view')
  , html = require('../html/account.html');

module.exports = View.extend({
  template: html,
  bindings: {
    'model.name': { type: 'text', hook: 'name' }
  }
});