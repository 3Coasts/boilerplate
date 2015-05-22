var models = require('../bin/models')
  , passport = require('../bin/passport')
  , extend = require('lodash.assign')
  , without = require('lodash.without');

exports.param = function (req, res, next) {
  models.User.findById(req.params.user, function (err, user) {
    if (err) return next(err);
    req.params.user = user;
    return next();
  });
};

exports.post = function (req, res, next) {
  models.User.register(req.body, function (err, user){
    if (err) return next(err);
    if (!user) return res.sendStatus(404);
    return res.json(user);
  });
};

exports.getMe = function (req, res) {
  return res.json(req.user);
};

exports.getUser = function (req, res) {
  return res.json(req.params.user);
};

exports.putUser = function (req, res, next) {
  var user = req.params.user;
  user = extend(user, req.body);
  user.save(function (err, user){
    if (err) return next(err);
    return res.json(user);
  })
};

exports.postLogin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(404).json(info);
    res.setHeader('access-token', info);
    return res.json(user);
  })(req, res, next);
};

exports.getLogout = function (req, res, next) {
  req.user.accessTokens = without(req.user.accessTokens, req.authInfo.accessToken);
  req.user.save();
  return res.sendStatus(302);
};

exports.postToken = function (req, res, next) {
  models.User.findOne({ phone: req.body.phone }, function (err, user) {
    if (err) return next(err);
    if (!user) return res.sendStatus(403);
    user.sendToken(function (err) {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
};