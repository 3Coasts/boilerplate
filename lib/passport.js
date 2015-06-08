var passport = require('passport')
  , LocalStrategy = require('passport-local')
  , uuid = require('uuid').v4
  , BearerStrategy = require('passport-http-bearer')
  , isArray = require('lodash.isarray')
  , omit = require('lodash.omit')
  , app = require('./app')


passport.use(new BearerStrategy(bearerStrategyCallback));
passport.use(new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'authToken'
}, localStrategyCallback));

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = passport;

function localStrategyCallback(phone, key, done) {
  app.models.access
    .findOne({ key: key })
    .populate('user')
    .catch(done)
    .then(function (access) {
      if (!access) return done(null, false, { message: 'Auth key not found' })

      var user = access.user;

      if (user.phone !== phone)
        return done(null, false, {message: 'Phone does not match'})

      app.models.access.update(access.id, { token: uuid(), key: null }, function (err, access) {
        if (err) return done(err);
        if (access.length !== 1) return done(null, false);
        return done(err, user, access[0]);
      });
    });
}

function bearerStrategyCallback(accessToken, done) {
  app.models.access
    .findOne({ token: accessToken })
    .populate('user')
    .catch(done)
    .then(function(access) {
      if (!access) return done(null, false);
      return done(null, access.user, omit(access, 'user'));
    });
}

function deserializeUser(id, done) {
  app.models.user.findOne({ slug: id }, function cb(err, user) {
    done(err, user);
  });
}

function serializeUser(user, done) {
  done(null, user.slug);
}