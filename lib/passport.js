var models = require('./models')
  , passport = require('passport')
  , LocalStrategy = require('passport-local')
  , uuid = require('uuid').v4
  , BearerStrategy = require('passport-http-bearer');

passport.use(new LocalStrategy({ usernameField: 'phone', passwordField: 'authToken' }, function (phone, authToken, done) {
  models.User.findOne({ phone: phone }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Phone not found' });
    if (user.authToken !== authToken) return done(null, false, { message: 'Incorrect Auth Token' });
    var accessToken = uuid();
    user.authToken = null;
    user.accessTokens.push(accessToken);
    user.save(function (err, user) {
      return done(err, user, accessToken);
    });
  });
}));

passport.use(new BearerStrategy(function(accessToken, done) {
  models.User.findOne({ accessTokens: accessToken }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    return done(null, user, { scope: 'all', accessToken: accessToken });
  });
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function (err, user) {
    done(err, user);
  });
});


module.exports = passport;