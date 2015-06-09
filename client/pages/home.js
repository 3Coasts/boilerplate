var View = require('ampersand-view')
  , marked = require('marked')
  , readme = require('../../README.md')
  , html = require('./home.html')

marked.setOptions({ gfm: true });

module.exports = View.extend({
  template: html,
  bindings: {
    readme: { type: 'innerHTML' }
  },
  initialize: function () {
    this.readme = marked(readme)
  }
});