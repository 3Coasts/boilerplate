var config = require('./config').twilio;

if (config.sid && config.token)
  var client = require('twilio')(config.sid, config.token);

module.exports = client || null;