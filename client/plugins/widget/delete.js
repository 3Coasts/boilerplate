var View = require('ampersand-view')
  , html = require('./delete.html');

module.exports = View.extend({
  template: html,
  events: {
    'click [data-hook=delete]': 'deleteArticle'
  },
  deleteArticle: function (e) {
    this.model.destroy({
      success: function () {
        app.msg('WIDGET_DELETED');
        app.nav('widget');
      }
    });
  }
});