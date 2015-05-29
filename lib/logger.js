var fs = require('fs')
  , contains = require('lodash.contains')
  , config = require('./config')

module.exports = function logger(req, res, next) {
  if (!config.isDev || !config.debug) return next()
  console.log('%s %s', req.method, req.url)
  if (contains(['POST', 'PUT', 'PATCH'], req.method)) console.log(req.body)
  next()
}
