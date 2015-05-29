var app = require('ampersand-app')
  , View = require('ampersand-view')
  , ViewSwitcher = require('ampersand-view-switcher')
  , NavView = require('./nav')
  , Messages = require('./messages/index')
  , html = require('./main.html');

module.exports = View.extend({

  template: html,

  autoRender: true,

  initialize: function() {
    this.listenTo(app, 'page', this.setPage);
    this.listenTo(app, 'secure-page', this.setPageSecure)
  },

  events: {
    'click a[href]': 'handleLinkClick'
  },

  render: function() {
    this.renderWithTemplate({me: app.me});
    this.pageSwitcher = new ViewSwitcher(this.queryByHook('page-container'));
    this.renderSubview(new NavView({ model: app.me }), this.queryByHook('nav'));
    this.renderSubview(new Messages(), this.queryByHook('messages-container'));
  },

  setPageSecure: function(view) {
    if (!app.me.signedIn) return app.nav('login');
    this.pageSwitcher.set(view);
  },

  setPage: function(view) {
    this.pageSwitcher.set(view);
  },

  handleLinkClick: function(e) {
    var aTag = e.target;
    var local = aTag.host === window.location.host;
    if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      app.nav(aTag.pathname);
    }
  }


});
