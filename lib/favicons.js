#!/usr/bin/env node

var favicons = require('favicons')
  , config = require('./config').favicon;

if (process.argv.length < 3)
  process.exit(1);

config.files.src = process.argv[2];

favicons(config, function (err) {
  if (err) throw err;
  process.exit(0);
});