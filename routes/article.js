var models = require('../lib/app').models;

exports.postArticle = function postArticle(req, res, next) {
  req.body.author = req.user;
  models.article.create(req.body, function(err, model) {
    if (err) return next(err);
    return res.json(model);
  })
};