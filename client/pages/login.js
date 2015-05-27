var View = require('ampersand-view')
  , xhr = require('xhr')
  , html = require('./login.html');

module.exports = View.extend({
  name: 'Login',
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
    app.me.phone = this.queryByHook('phone').value;
    xhr({
      method: 'POST',
      url: '/api/v1/user/token',
      json: { phone: app.me.phone }
    }, function (err, resp, body) {
      if (err) return console.error(err);
      if (resp.statusCode === 404) return app.msg('USER_NOT_FOUND', true);
      app.msg('USER_TOKEN_SENT');
      app.nav('/login/verify');
    });
  }
});