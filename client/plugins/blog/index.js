var View = require('ampersand-view')
  , Teaser = require('./teaser')
  , Paginator = require('../../views/paginator')
  , html = require('./index.html');

module.exports = View.extend({
  template: html,
  bindings: {
    'app.me.signedIn': { type: 'toggle', yes: '[data-hook=admin]' }
  },
  props: {
    'paginator': 'any'
  },
  render: function () {
    var view = this;
    view.renderWithTemplate();
    view.renderCollection(view.collection, Teaser, view.queryByHook('articles'));
    view.paginator = new Paginator({ limit: 10 });
    view.renderSubview(view.paginator, view.queryByHook('paginator'));
    view.doFetch(view.paginator);
    view.paginator.on('change:skip', function () {
      view.doFetch(this);
    });
  },
  doFetch: function (paginator) {
    this.collection.fetch({
      data: { limit: paginator.limit, skip: paginator.skip },
      success: function (collection, body, response) {
        var headers = response.xhr.headers;
        if (headers.count) paginator.count = Number(headers.count);
      }
    });
  }
});