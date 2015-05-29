var app = require('ampersand-app')
  , View = require('ampersand-view')
  , html = require('./edit.html');

module.exports = View.extend({
  template: html,

  bindings: {
    'model.title': { type: 'attribute', name: 'value', hook: 'title' },
    'model.summary': { type: 'text', hook: 'summary' },
    'model.body': { type: 'text', hook: 'body' }
  },

  events: {
    'blur [data-hook=title]': 'titleChange',
    'blur [data-hook=summary]': 'summaryChange',
    'blur [data-hook=body]': 'bodyChange',
    'submit form': 'submitForm'
  },

  titleChange: function(e) {
    this.model.title = e.target.value;
  },

  summaryChange: function(e) {
    this.model.summary = e.target.value;
  },

  bodyChange: function(e) {
    this.model.body = e.target.value;
  },

  submitForm: function(e) {
    e.preventDefault();
    var isNew = this.model.isNew();
    this.model.save(null, {
      success: function(model) {
        app.msg(isNew ? 'ARTICLE_CREATED' : 'ARTICLE_UPDATED');
        app.nav(model.viewLink);
      },
      error: function(model, response, options) {
        console.log(response.body.error);
      }
    });
  }

});