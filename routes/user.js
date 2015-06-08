var passport = require('../lib/passport')
  , models = require('../lib/app').models;

exports.postUser = function postUser(req, res, next) {
  models.user.register(req.body, function cb(err, user) {
    if (err) return next(err);
    if (!user) return res.sendStatus(404);
    return res.json(user);
  });
};

exports.getUserMe = function getUserMe(req, res) {
  return res.json(req.user);
};

exports.postUserLogin = function postUserLogin(req, res, next) {
  passport.authenticate('local', function passportAuthCb(err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(404).json(info);
    res.setHeader('access-token', info.token);
    return res.json(user);
  })(req, res, next);
};

exports.getUserLogout = function getUserLogout(req, res, next) {
  req.authInfo.destroy(function (err) {
    if (err) return next(err);
    return res.sendStatus(302);
  })
};

exports.postUserToken = function postUserToken(req, res, next) {
  models.user.findOne({phone: req.body.phone}, function cb(err, user) {
    if (err) return next(err);
    if (!user) return res.sendStatus(404);
    user.sendToken(function sendTokenCb(err) {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
};