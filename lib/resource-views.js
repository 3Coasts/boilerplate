var fs = require('fs')
  , Handlebars = require('./handlebars')
  , caps = require('lodash.capitalize')
  , toArray = require('lodash.toarray')
  , mapValues = require('lodash.mapvalues')
  , isNull = require('lodash.isnull')
  , find = require('lodash.find')
  , contains = require('lodash.contains')
  , dirsum = require('dirsum')
  , deleteFolder = require('./delete-folder')
  , uuid = require('uuid').v4
  , resources = require('../Resources.json')
  , async = require('async')


resources.forEach(eachResource);

function eachResource(resource) {
  if (!resource.view) return

  var clientViewPath = __dirname + '/../client/plugins/' + resource.name + '/'
    , templatePath = __dirname + '/templates/view/'
    , checksumPath = __dirname + '/../client/plugins/.' + resource.name + '.md5'
    , oldChecksum, newChecksum;

  var voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

  var attributes = toArray(mapValues(resource.model.attributes, function(value, key) {
    var inputElementAttributes = value.inputElementAttributes || {}
    if (!inputElementAttributes.type)
      inputElementAttributes.type = 'text'
    return {
      id: uuid(),
      lowercase: key.toLowerCase(),
      capitalized: caps(key),
      type: value.type,
      remove: value.remove || false,
      model: value.model ? {
        title: find(resources, { name: value.model }).view.titleField,
        name: value.model,
        capitalized: caps(value.model)
      } : false,
      inputElement: value.inputElement || 'input',
      inputIsNotVoidElement: !contains(voidElements, value.inputElement || 'input'),
      inputElementAttributes: inputElementAttributes
    }
  }));

  var viewConfig = {
    name: resource.name,
    nameCapitalized: caps(resource.name),
    nameAllCaps: resource.name.toUpperCase(),
    titleField: resource.view.titleField,
    teaserFields: returnAttributes(resource.view.teaserFields),
    detailFields: returnAttributes(resource.view.detailFields),
    attributes: attributes
  };

  function returnAttributes(fields) {
    var toReturn = [];
    for (var x in fields)
      toReturn.push(find(attributes, { lowercase: fields[x] }));
    return toReturn;
  }

  async.waterfall([

    // Read checksum from existing view plugin
    function(cb) {
      fs.readFile(checksumPath, { encoding: 'utf8' }, function (err, checksum) {
        return cb(null, checksum);
      })
    },

    // Assign to oldChecksum and read files to create newChecksum
    function(md5, cb) {
      oldChecksum = md5 || null;
      if (isNull(oldChecksum)) return cb(null, null)
      dirsum.digest(clientViewPath, 'md5', cb);
    },

    // Assign newChecksum and compare, if the same delete plugin folder
    function(hashes, cb) {
      if (isNull(oldChecksum)) return cb(null)
      newChecksum = hashes.hash;
      if (oldChecksum !== newChecksum)
        return cb(new Error('Checksum mismatch.'))
      deleteFolder(clientViewPath);
      cb(null);
    },

    // Check if plugin folder exists
    function(cb) {
      fs.lstat(clientViewPath, function(err, folderStats) {
        if (err) return cb(null, false)
        cb(null, folderStats.isDirectory());
      })
    },

    // If folder doesn't exists create it
    function(exists, cb) {
      if (exists) return cb(null)
      fs.mkdir(clientViewPath, cb)
    },

    // List files in template directory
    function(cb) {
      fs.readdir(templatePath, cb);
    },

    // Write template files
    function(files, cb) {
      async.each(files, function(file, cb) {
        fs.readFile(templatePath + file, { encoding: 'utf8' }, function(err, template) {
          if (err) return cb(err);
          hbTemplate = Handlebars.compile(template);
          fs.writeFile(clientViewPath + file.replace('.hbs', ''), hbTemplate(viewConfig), cb);
        })
      }, cb);
    },

    // Get new checksum
    function(cb) {
      dirsum.digest(clientViewPath, 'md5', cb);
    },

    // Write new checksum
    function(hashes, cb) {
      fs.writeFile(checksumPath, hashes.hash, cb);
    }
  ], function(err){
    if (err) console.error(err);
  })

}