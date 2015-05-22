var mongoose = exports.mongoose = require('mongoose')
  , config = require('../bin/config')
  , twilio = require('../bin/twilio')
  , token = require('../bin/token')
  , isUndefined = require('lodash.isundefined')
  , isFunction = require('lodash.isfunction');


var schema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String, unique: true },
  authToken: { type: String },
  accessTokens: { type: Array, default: [] },
  createdAt: { type: Date },
  updatedAt: { type: Date }
});

schema.pre('save', function(next) {
  var user = this;
  user.updatedAt = new Date();
  if(!user.createdAt){
    user.createdAt = new Date();
  }
  user.phone = user.phone.replace(/\D/g,'');
  next();
});

schema.static('register', function (data, cb) {
  if(isUndefined(data.phone)) return cb("NO_PHONE", false);
  var user = new this(data);
  user.save(function (err, user) {
    if(err) return cb(err);
    cb(null, user);
  });
});

schema.method('toJSON', function() {
  var user = this.toObject();
  delete user.authToken;
  delete user.accessTokens;
  delete user.phone;
  return user;
});

schema.method('sendToken', function (cb) {
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
});


module.exports = schema;