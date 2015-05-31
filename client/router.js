var app = require('ampersand-app')
  , Router = require('ampersand-router')
  , xhr = require('xhr')
  , each = require('lodash.foreach')
  , plugins = require('./config').plugins || [];

var HomePage = require('./pages/home')
  , LoginPage = require('./pages/login')
  , LoginVerificationPage = require('./pages/login-verification.js')
  , RegisterPage = require('./pages/register')
  , AccountPage = require('./pages/account');

module.exports = Router.extend({

  initialize: function() {
    // Add plugin routes
    var router = this;
    each(plugins, function(plugin) {
      require('./plugins/' + plugin + '/routes')(router);
    });
  },

  routes: {
    '': 'home',
    register: 'register',
    login: 'login',
    'login/verify': 'loginVerify',
    logout: 'logout',
    account: 'account',
    '(*path)': 'catchAll'
  },

  home: function() {
    app.trigger('page', new HomePage({ model: app.me }))
  },

  register: function() {
    app.trigger('page', new RegisterPage({ model: app.me }))
  },

  login: function() {
    app.trigger('page', new LoginPage({ model: app.me }));
  },

  loginVerify: function() {
    if (!app.me.phone) return app.nav('login');
    app.trigger('page', new LoginVerificationPage({ model: app.me }))
  },

  logout: function() {
    xhr({
      method: 'GET',
      url: '/api/v1/user/logout',
      headers: { Authorization: 'Bearer ' + window.localStorage.accessToken || '' }
    }, function() {
      delete window.localStorage.accessToken;
      window.location.href = '/';
    });
  },

  account: function() {
    app.trigger('secure-page', new AccountPage({ model: app.me }))
  },


  catchAll: function() {
    this.redirectTo('/')
  }

});