var mongoose = require('mongoose')
  , config = require('./config')
  , fs = require('fs');

mongoose.connect("mongodb://" + config.mongo.host + "/" + config.mongo.database, {
  user: config.mongo.user || null,
  pass: config.mongo.pass || null
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// get the subdirectories
var modelFiles = fs.readdirSync('./models');
for(var i = 0; i < modelFiles.length; i++) {
  var parts = modelFiles[i].split('.');
  if(parts[parts.length-1] != 'js') continue; // skip non-js files

  // remove the extension so it's just 'user'
  var modelName = parts[0];

  if(modelName == 'index') continue; // skip this file

  var schema = require('../models/' + modelName);
  // uppercase first letter so it's User
  modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  // make the schema be UserSchema
  schemaName = modelName + 'Schema';
  // load and export the model
  exports[schemaName] = schema;
  exports[modelName] = mongoose.model(modelName, schema);
}
