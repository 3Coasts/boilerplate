var fs = require('fs')
  , Mustache = require('mustache')
  , caps = require('lodash.capitalize')
  , toArray = require('lodash.toarray')
  , mapValues = require('lodash.mapvalues')
  , find = require('lodash.find')
  , dirsum = require('dirsum')
  , deleteFolder = require('./delete-folder')
  , resources = require('../resources.json')

resources.forEach(eachResource);

//function checksums() {
//  dirsum.digest(clientViewPath, 'sha1', function(err, hashes) {
//    if (err) throw err;
//    resource.hash = hashes.hash;
//    if (index === resources.length)
//      fs.writeFileSync(__dirname + '/../resources.json', JSON.stringify(resources, null, '\t'));
//  });
//}

function eachResource(resource) {

  if (!resource.view) return

  var clientViewPath = __dirname + '/../client/plugins/' + resource.name + '/'
  var templatePath = __dirname + '/templates/view/'

  deleteFolder(clientViewPath);

  if (fs.existsSync(clientViewPath)) return

  fs.mkdirSync(clientViewPath)

  var attributes = toArray(mapValues(resource.model.attributes, function(value, key) {
    return {
      lowercase: key.toLowerCase(),
      capitalized: caps(key),
      type: value.type
    }
  }));

  function returnAttributes(fields) {
    var toReturn = [];
    for(var x in fields)
      toReturn.push(find(attributes, { lowercase: fields[x] }));
    return toReturn;
  }

  var viewConfig = {
    name: resource.name,
    nameCapitalized: caps(resource.name),
    nameAllCaps: resource.name.toUpperCase(),
    titleField: resource.view.titleField,
    teaserFields: returnAttributes(resource.view.teaserFields),
    detailFields: returnAttributes(resource.view.detailFields),
    attributes: attributes
  };

  var templateFiles = fs.readdirSync(templatePath)

  templateFiles.forEach(function(file) {
    var template = fs.readFileSync(templatePath + file, { encoding: 'utf8' })
    var output = Mustache.render(template, viewConfig);
    fs.writeFileSync(clientViewPath + file, output);
  });

}