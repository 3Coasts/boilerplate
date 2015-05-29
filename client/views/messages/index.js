var View = require('ampersand-view')
  , isString = require('lodash.isstring')
  , isObject = require('lodash.isobject')
  , vprintf = require('sprintf-js').vsprintf
  , Collection = require('./collection')
  , Model = require('./model')
  , Message = require('./message')
  , messages = require('../../messages.json')
  , html = require('./index.html');

module.exports = View.extend({
  template: html,
  initialize: function() {
    this.collection = new Collection();
    app.msg = this.add.bind(this);
  },
  render: function() {
    this.renderWithTemplate();
    this.renderCollection(this.collection, Message)
  },

  // API
  // app.msg('offline', true);
  // app.msg('missing_input', true, ['First Name'])
  // app.msg(false)
  // app.msg('no name', true)

  add: function addMessage(token, error, args) {
    var text;

    error = error || token === true ? 'error' : 'info';

    if (arguments.length === 1 && !isString(token))
      text = token === true ? 'Error.' : 'Success.';
    else if (isString(token))
      text = messages[token] || token;

    if (args && isObject(args))
      text = vprintf(text, args);

    this.collection.add({ type: error, message: text });
  }
});