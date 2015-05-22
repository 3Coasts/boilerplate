var config = require('./config').twilio
  , client = require('twilio')(config.sid, config.token);

module.exports = client;