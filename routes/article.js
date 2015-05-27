var Article = require('../lib/models').Article;

exports.postArticle = function (req, res, next) {
  req.body.author = req.user;
  var doc = new Article(req.body);
  doc.save(function (err, doc) {
    if (err) return next(err);
    return res.json(doc);
  });
};