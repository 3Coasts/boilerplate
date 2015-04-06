var config = require('./config'),
  redis = require('redis').createClient(config.redis_port, config.redis_host);

if (config.redis_password) {
  redis.auth(config.redis_password);
}

module.exports = redis;