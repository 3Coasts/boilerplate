'use strict';

var AmpersandCollection = require('ampersand-collection'),
  Model = require('./model');

module.exports = AmpersandCollection.extend({
  model: Model
});