var View = require('ampersand-view')
  , html = require('./page.html');

module.exports = View.extend({
  template: html,
  bindings: {
    'model.number': { type: 'text', hook: 'item' },
    'model.current': { type: 'booleanClass', name: 'current-item', hook: 'item' }
  },
  events: {
    'click a': 'clickEvent'
  },
  clickEvent: function() {
    this.parent.numberClick(this.model.number);
  }
});