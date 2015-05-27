#!/usr/bin/env node

var favicons = require('favicons')
  , config = require('./config').favicon;

favicons(config);