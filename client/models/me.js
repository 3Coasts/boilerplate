var User = require('./user');

module.exports = User.extend({
  modelType: 'Me',
  url: '/api/v1/user/me',
  session: {
    signedIn: { type: 'boolean', default: false }
  },
  initialize: function() {
    var me = this;

    if (window.localStorage.accessToken)
      me.fetch({
        success: function() {
          me.signedIn = true;
        },
        error: function() {
          me.signedIn = false;
        }
      });

  }
});
