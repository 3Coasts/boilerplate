var models = require('./models')
  , passport = require('passport')
  , LocalStrategy = require('passport-local')
  , uuid = require('uuid').v4
  , BearerStrategy = require('passport-http-bearer')


passport.use(new BearerStrategy(bearerStrategyCallback));
passport.use(new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'authToken'
}, localStrategyCallback));

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

module.exports = passport;

function localStrategyCallback(phone, authToken, done) {
  models.User.findOne({ phone: phone }, function cb(err, user) {
    if (err) return done(err)
    if (!user) return done(null, false, { message: 'Phone not found' })
    if (user.authToken !== authToken)
      return done(null, false, { message: 'Incorrect Auth Token' })
    var accessToken = uuid();
    user.authToken = null;
    user.accessTokens.push(accessToken);
    user.save(function cb(err, user) {
      return done(err, user, accessToken);
    });
  });
}

function bearerStrategyCallback(accessToken, done) {
  models.User.findOne({ accessTokens: accessToken }, function cb(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    return done(null, user, { scope: 'all', accessToken: accessToken });
  });
}

function deserializeUser(id, done) {
  models.User.findById(id, function cb(err, user) {
    done(err, user);
  });
}

function serializeUser(user, done) {
  done(null, user.id);
}