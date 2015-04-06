var Router = require('ampersand-router');

module.exports = Router.extend({

  routes: {
    "home": "home"
  },

  home: function() {
    var View = require('./pages/home');
    return this.trigger('page', new View(params || {}));
  }

});