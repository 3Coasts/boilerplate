var fs = require('fs'),
  resourceFiles = fs.readdirSync(__dirname + '/../routes'),
  camel = require('amp-to-camel-case'),
  routeTypeArray = [];

resourceFiles.forEach(function (file) {
  if (file.split('.').pop() !== 'js') { return; }
  var fileName = file.split('.').shift();
  routeTypeArray[camel(fileName)] = require('../routes/' + fileName);
});

module.exports = routeTypeArray;