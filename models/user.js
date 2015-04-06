var mongoose = exports.mongoose = require('mongoose')
  , config = require('../bin/config')
  , bcrypt = require('bcrypt')
  , token = require('../bin/token')
  , email = require('../bin/email')
  , defaults = require('../bin/model-defaults')
  , isUndefined = require('amp-is-undefined')
  , passwordTest = require('../bin/password-test');


var schema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  active: { type: Boolean, default: false }
});

schema.pre('save', true, function(password, other) {
  var user = this;
  user = defaults.save(user);
  user.email = user.email.toLowerCase();
  other();

  if(isUndefined(user.password))
    password();

  if(!user.isModified('password'))
    password();
  else
    updatePass();

  function updatePass () {
    bcrypt.genSalt(10, function(err, salt) {
      if(err) return password(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return password(err);
        user.password = hash;
        password();
      });
    });
  }
});

schema.static('register', function (data, cb) {

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(isUndefined(data.email)) return cb("NO_EMAIL", false);
  if(!re.test(data.email)) return cb("INVALID_EMAIL", false);

  var user = new this(data);
  user.save(sendEmail);

  function sendEmail(err, user) {
    if(err){
      if(err.code === 11000) return cb('ACCOUNT_EXISTS');
      return cb(err);
    }

    var args = {
      type: 'user-new',
      subject: "Welcome to Airpnp!",
      users: user,
      host: config.host
    };
    email(args, function (err, response){
      if(err) throw err;
      cb(null, user);
    });

  }

});

schema.static('reset', function ( email, cb ){
  this.findOne({'email': email}, function(err, user){
    if (err) cb(err);
    if (!user) return cb();
    user.token = token();
    user.save(cb);
  });
});



schema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};


module.exports = schema;