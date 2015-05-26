var app = require('ampersand-app')
  , View = require('ampersand-view')
  , ViewSwitcher = require('ampersand-view-switcher')
  , setFavicon = require('favicon-setter')
  , NavView = require('./nav')
  , html = require('./main.html')


module.exports = View.extend({

  template: html,

  autoRender: true,

  initialize: function () {
    this.listenTo(app, 'page', this.setPage);
    this.listenTo(app, 'secure-page', this.setPageSecure)
  },

  events: {
    'click a[href]': 'handleLinkClick'
  },

  render: function () {
    var view = this;
    view.renderWithTemplate({me: app.me});
    view.pageSwitcher = new ViewSwitcher(view.queryByHook('page-container'));
    view.renderSubview(new NavView({ model: app.me }), view.queryByHook('nav'));
    //setFavicon('/path/to/image.png');
    return view;
  },

  setPageSecure: function (view) {
    if (!app.me.signedIn) return app.nav('login');
    this.pageSwitcher.set(view);
  },

  setPage: function (view) {
    this.pageSwitcher.set(view);
  },

  handleLinkClick: function (e) {
    var aTag = e.target;
    var local = aTag.host === window.location.host;
    if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      app.nav(aTag.pathname);
    }
  }


});
