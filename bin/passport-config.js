var models = require('./models');

module.exports = function (passport, LocalStrategy) {

  passport.use(new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
    models.User.findOne({ email: email.toLowerCase() }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect Email' }); }
      user.comparePassword(password, function (err, isMatch) {
        if (err) { return done(err); }
        if (isMatch) { return done(null, user); }
        return done(null, false, { message: 'Incorrect Password' });
      });
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


};