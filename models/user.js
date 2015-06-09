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
      var models = require('../lib/app').models;
      var user = this;

      models.access.create({ key: token(7, '1234567890'), user: user.id }, function (err, access) {
        if (err) return cb(err);

        setTimeout(function clearAuthToken() {
          models.access.findOne(access.id, function(err, access) {
            if (err) console.error(err)
            if (!access) return;
            if (!access.token)
              access.destroy(function (err) {
                if (err) console.error(err)
              })
          })
        }, config.authTokenTimeout);

        if (config.isDev) {
          console.log('Authorization Token: ' + access.key);
          return cb(null);
        }

        twilio.sendMessage({
          from: config.twilio.number,
          to: user.phone,
          body: 'Authentication Token: ' + access.key
        }, cb);

      });

    }
  }
};