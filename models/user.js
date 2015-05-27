var config = require('../lib/config')
  , twilio = require('../lib/twilio')
  , token = require('../lib/token')
  , isUndefined = require('lodash.isundefined');

module.exports = {
  preSave: function (cb) {
    this.phone = this.phone.replace(/\D/g,'');
    cb();
  },
  statics: {
    register: function (data, cb) {
      if(isUndefined(data.phone)) return cb("NO_PHONE", false);
      var user = new this(data);
      user.save(function (err, user) {
        if(err) return cb(err);
        cb(null, user);
      });
    }
  },
  instanceMethods: {
    sendToken: function (cb) {
      var user = this;
      user.authToken = token(7, '1234567890');
      user.save(function (err) {
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
      setTimeout(function () {
        user.authToken = null;
        user.save();
      }, config.authTokenTimeout);
    }
  }
};