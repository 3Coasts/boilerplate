var app = require('ampersand-app')
  , View = require('ampersand-view')
  , ViewSwitcher = require('ampersand-view-switcher')
  , setFavicon = require('favicon-setter')
  , addClass = require('amp-add-class')
  , removeClass = require('amp-remove-class')
  , NavView = require('./nav');


module.exports = View.extend({

  template: require('./main.html'),

  initialize: function () {
    var view = this;
    view.listenTo(app.router, 'page', this.handleNewPage);
  },

  events: {
    'click a[href]': 'handleLinkClick'
  },

  render: function () {
    var view = this;
    view.renderWithTemplate({me: app.me});
    view.pageSwitcher = new ViewSwitcher(view.queryByHook('page-container'), {
      show: function (newView, oldView) {
        document.scrollTop = 0;
        addClass(newView.el, 'active');
        app.currentPage = newView;
      }
    });
    //setFavicon('/path/to/image.png');
    return view;
  },

  subviews: {
    nav: {
      container: '[data-hook=nav]',
      prepareView: function (el) {
        return new NavView({ el: el });
      }
    }
  },

  handleNewPage: function (view) {
    this.pageSwitcher.set(view);
    this.updateActiveNav();
  },

  handleLinkClick: function (e) {
    var aTag = e.target;
    var local = aTag.host === window.location.host;
    if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      app.nav(aTag.pathname);
    }
  },

  updateActiveNav: function () {
    var path = window.location.pathname.slice(1);
    this.queryAll('.nav a[href]').forEach(function (aTag) {
      var aPath = aTag.pathname.slice(1);
      if ((!aPath && !path) || (aPath && path.indexOf(aPath) === 0)) {
        addClass(aTag.parentNode, 'active');
      } else {
        removeClass(aTag.parentNode, 'active');
      }
    });
  }

});