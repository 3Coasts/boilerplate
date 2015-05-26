var models = require('../lib/models')
  , passport = require('../lib/passport')
  , extend = require('lodash.assign')
  , without = require('lodash.without');

exports.postUser = function (req, res, next) {
  models.User.register(req.body, function (err, user) {
    if (err) return next(err);
    if (!user) return res.sendStatus(404);
    return res.json(user);
  });
};

exports.getUserMe = function (req, res) {
  return res.json(req.user);
};

exports.postUserLogin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(404).json(info);
    res.setHeader('access-token', info);
    return res.json(user);
  })(req, res, next);
};

exports.getUserLogout = function (req, res, next) {
  req.user.accessTokens = without(req.user.accessTokens, req.authInfo.accessToken);
  req.user.save();
  return res.sendStatus(302);
};

exports.postUserToken = function (req, res, next) {
  models.User.findOne({phone: req.body.phone}, function (err, user) {
    if (err) return next(err);
    if (!user) return res.sendStatus(403);
    user.sendToken(function (err) {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
};