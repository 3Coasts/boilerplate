var config = require('../lib/config')
  , twilio = require('../lib/twilio')
  , token = require('../lib/token')
  , isUndefined = require('lodash.isundefined');

module.exports = {
  hooks: {
    beforeValidate: function preSave(values, cb) {
      if (values.phone)
        values.phone = values.phone.replace(/\D/g, '');
      cb();
    }
  },
  classMethods: {
    register: function register(data, cb) {
      if (isUndefined(data.phone)) return cb('NO_PHONE', false);
      this.create(data, function(err, user) {
        if (err) return cb(err);
        cb(null, user);
      });
    }
  },
  instanceMethods: {
    sendToken: function sendToken(cb) {
      var user = this;
      user.authToken = token(7, '1234567890');
      user.save(function userSaveCb(err) {
        if (err) return cb(err);
        if (config.isDev) {
          console.log('Authorization Token: ' + user.authToken);
          return cb(null);
        }
        twilio.sendMessage({
          from: config.twilio.number,
          to: user.phone,
          body: 'Authentication Token: ' + user.authToken
        }, cb);
      });
      setTimeout(function clearAuthToken() {
        var models = require('../lib/app').models;
        models.user.update({ slug: user.slug }, { authToken: null }).exec(function() {})
      }, config.authTokenTimeout);
    }
  }
};