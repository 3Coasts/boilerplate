var errorhandler = require('errorhandler')
  , config = require('./config')

module.exports = config.isDev ? errorhandler() : productionErrorHandler

function productionErrorHandler(err, req, res, next) {
  if (err.status)
    res.statusCode = err.status

  // Default status code to 500
  if (res.statusCode < 400)
    res.statusCode = 500

  // Cannot actually respond
  if (res._header)
    return req.socket.destroy()

  // Security header for content sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')

  var error = err.message;
  var json = JSON.stringify({ error: error });
  res.setHeader('Content-Type', 'application/json');
  res.end(json);

}
