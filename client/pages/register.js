var View = require('ampersand-view')
  , xhr = require('xhr')
  , html = require('../html/register.html')
  , Users = require('../models/user-collection');

module.exports = View.extend({
  template: html,
  bindings: {
    'model.firstName': { type: 'attribute', name: 'value', hook: 'first-name' },
    'model.lastName': { type: 'attribute', name: 'value', hook: 'last-name' },
    'model.email': { type: 'attribute', name: 'value', hook: 'email' }
  },
  events: {
    'submit form': 'onSubmitForm'
  },
  initialize: function () {
    this.collection = new Users();
    this.model.on('change:signedIn', function (model) {
      if (model.signedIn) app.nav('account');
    });
  },
  onSubmitForm: function (e) {
    e.preventDefault();
    var me = {
      name: this.queryByHook('name').value,
      phone: this.queryByHook('phone').value
    };
    app.me.phone = me.phone;
    this.collection.create(me, {
      success: function () {
        xhr({
          method: 'POST',
          url: '/api/v1/user/token',
          json: { phone: me.phone }
        }, function (err) {
          if (err) return console.error(err);
          app.nav('/login/verify');
        });
      }
    });
  }
});