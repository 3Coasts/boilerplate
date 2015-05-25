var fs = require('fs'),
  config = JSON.parse(JSON.stringify(process.env)),
  each = require('lodash.foreach');

var configFiles = fs.readdirSync(__dirname + '/../config');

each(configFiles, function (file) {
  if (file === 'config.js.example') { return; }
  var parts = file.split('.');
  if (parts[parts.length - 1] !== 'js') { return; }
  var configName = parts[0];
  var configItems = require('../config/' + configName);
  each(configItems, function (item, index) {
    config[index] = item;
  });
});

if (config.environment) {
  config.isDev = config.environment === 'production' ? false : true;
} else {
  config.isDev = true;
}

module.exports = config;