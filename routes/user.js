var models = require('../bin/models')
  , extend = require('amp-extend');

exports.param = function (req, res, next) {
  models.User.findById(req.params.user, function (err, user) {
    if (err) return next(err);
    req.params.user = user;
    next();
  });
};

exports.add = function (req, res, next) {
  models.User.register(req.body, function (err, user){
    if (err) return next(err);
    return res.json(user);
  });
};

exports.get = function (req, res, next) {
  return res.json(req.params.user);
};

exports.update = function (req, res, next) {
  var user = req.params.user;
  user = extend(user, req.body);
  user.save(function (err, user){
    if (err) return next(err);
    return res.json(user);
  })
};