var View = require('ampersand-view')
  , html = require('./nav.html')

module.exports = View.extend({
  template: html,
  bindings: {
    'model.signedIn': {
      type: 'toggle',
      yes: '[data-hook=logout],[data-hook=account]',
      no: '[data-hook=login],[data-hook=register]'
    }
  }
});