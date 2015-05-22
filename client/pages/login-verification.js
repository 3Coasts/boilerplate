var app = require('ampersand-app')
  , View = require('ampersand-view')
  , xhr = require('xhr')
  , html = require('../html/login-verification.html');

module.exports = View.extend({
  name: 'LoginVerification',
  template: html,
  events: {
    'submit form': 'onSubmitForm'
  },
  initialize: function () {
    this.model.on('change:signedIn', function (model) {
      if (model.signedIn) app.nav('account');
    });
  },
  onSubmitForm: function (e) {
    e.preventDefault();
    xhr({
      method: 'POST',
      url: '/api/v1/user/login',
      json: {
        authToken: this.queryByHook('auth-token').value,
        phone: app.me.phone
      }
    }, function (err, resp, body) {
      if (err) return console.error(err);
      window.localStorage.accessToken = resp.headers['access-token'];
      app.me.set(body);
      app.me.signedIn = true;
      app.nav('account');
    });
  }
});