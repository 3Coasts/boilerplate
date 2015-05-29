var fs = require('fs')
  , each = require('lodash.foreach')
  , clone = require('lodash.clone')
  , config = clone(process.env);

var configFiles = fs.readdirSync(__dirname + '/../config')

each(configFiles, function eachConfigFile(file) {
  if (file === 'config.js.example') return
  var parts = file.split('.')
  if (parts[parts.length - 1] !== 'js') return
  var configName = parts[0]
  var configItems = require('../config/' + configName)
  each(configItems, function eachConfigItem(item, index) {
    config[index] = item;
  })
})

config.environment = config.environment || 'development'

config.isDev = config.environment !== 'production'

module.exports = config
