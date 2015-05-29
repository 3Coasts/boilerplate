var app = require('ampersand-app')
  , Model = require('ampersand-model');

module.exports = Model.extend({
  ajaxConfig: function() {
    return {
      headers: {
        Authorization: 'Bearer ' + window.localStorage.accessToken || ''
      }
    }
  }
});