var Waterline = require('waterline')
  , diskAdapter = require('sails-disk')
  , orm = new Waterline()
  , fs = require('fs')
  , model = require('./model')
  , events = require('./events')
  , resources = require('../resources.json')


var ormConfig = {
  adapters: { 'default': diskAdapter, disk: diskAdapter },
  connections: { disk: { adapter: 'disk' } },
  defaults: { migrate: 'alter' }
};

resources.forEach(function eachResource(resource) {
  var modelPath = '../models/' + resource.name + '.js';
  if (fs.existsSync(__dirname + '/' + modelPath))
    var overrides = require(modelPath);
  else
    fs.writeFileSync(__dirname + '/' + modelPath, '//model stub');
  orm.loadCollection(model(resource, overrides));
});

orm.initialize(ormConfig, function(err, obj) {
  if (err) throw err;
  events.emit('orm-initialized', obj);
});

