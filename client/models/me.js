var User = require('./user');

module.exports = User.extend({
  modelType: 'Me',
  url: '/api/v1/user/me',
  session: {
    signedIn: { type: 'boolean', default: false }
  },
  initialize: function() {
    var me = this;
    this.on('sync', function() {
      me.signedIn = true;
    });
    this.on('error', function() {
      me.signedIn = false;
    });
  }
});
