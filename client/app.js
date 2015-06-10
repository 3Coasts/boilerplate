var app = require('ampersand-app')
  , domReady = require('domready')
  , bind = require('lodash.bind')
  , styles = require('./styles/main.styl')
  , fastclick = require('fastclick')
  , Me = require('./models/me')
  , Router = require('./router')
  , config = require('./config')
  , MainView = require('./views/main');


app.extend({
  me: new Me(),
  router: new Router(),
  init: function() {
    fastclick.attach(document.body);
    new MainView({el: document.body});
    this.router.history.start({ pushState: true });
  },
  nav: function(page) {
    var url = (page.charAt(0) === '/') ? page.slice(1) : page;
    this.router.history.navigate(url, { trigger: true });
  }
});

domReady(bind(app.init, app));

if (config.isDev) window.app = app