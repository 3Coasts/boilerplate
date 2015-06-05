var Waterline = require('waterline')
  , diskAdapter = require('sails-disk')
  , mongoAdapter = require('sails-mongo')
  , orm = new Waterline()
  , fs = require('fs')
  , config = require('./config')
  , Model = require('./model')
  , events = require('./events')
  , resources = require('../resources.json')

if (!config.databases)
  throw new Error('Missing databases property in ./config')

var ormConfig = {
  adapters: {
    default: config.databases.default + 'Adapter',
    disk: diskAdapter,
    mongo: mongoAdapter
  },
  connections: {},
  defaults: {
    migrate: 'alter'
  }
};

for (var x in config.databases)
  if (x !== 'default') {
    ormConfig.connections[x] = config.databases[x];
    ormConfig.connections[x].adapter = x;
  }


resources.forEach(function eachResource(resource) {
  var modelPath = '../models/' + resource.name + '.js';
  var modelTemplate = fs.readFileSync(__dirname + '/templates/model.js', { encoding: 'utf8' });
  if (!fs.existsSync(__dirname + '/' + modelPath))
    fs.writeFileSync(__dirname + '/' + modelPath, modelTemplate);
  var overrides = require(modelPath);
  var model = new Model(resource, overrides);
  orm.loadCollection(model.Model);
});

orm.initialize(ormConfig, function(err, obj) {
  if (err) throw err;
  events.emit('orm-initialized', obj);
});

