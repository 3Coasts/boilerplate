var passport = require('passport')
  , LocalStrategy = require('passport-local')
  , uuid = require('uuid').v4
  , BearerStrategy = require('passport-http-bearer')
  , isArray = require('lodash.isarray')
  , app = require('./app')


passport.use(new BearerStrategy(bearerStrategyCallback));
passport.use(new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'authToken'
}, localStrategyCallback));

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = passport;

function localStrategyCallback(phone, authToken, done) {
  app.models.user.findOne({ where: { phone: phone }, select: ['id', 'authToken', 'accessTokens'] })
    .exec(function cb(err, user) {
      if (err) return done(err)
      if (!user) return done(null, false, { message: 'Phone not found' })
      if (user.authToken !== authToken)
        return done(null, false, { message: 'Incorrect Auth Token' })
      var accessToken = uuid();
      user.authToken = null;
      if (!isArray(user.accessTokens))
        user.accessTokens = [];
      user.accessTokens.push(accessToken);
      user.save(function cb(err, user) {
        return done(err, user, accessToken);
      });
    });
}

function bearerStrategyCallback(accessToken, done) {
  app.models.user.findOne({ accessTokens: { contains: accessToken } }, function cb(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    return done(null, user, { scope: 'all', accessToken: accessToken });
  });
}

function deserializeUser(id, done) {
  app.models.user.findById(id, function cb(err, user) {
    done(err, user);
  });
}

function serializeUser(user, done) {
  done(null, user.id);
}