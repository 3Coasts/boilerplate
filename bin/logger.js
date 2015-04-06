var fs = require('fs'),
  config = require('./config');

module.exports = function (req, res, next) {
  if (!config.isDev || !config.debug) return next();
  console.log('%s %s', req.method, req.url);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log(req.body);
  }
  next();
};
