var app = require('ampersand-app')
  , extend = require('lodash.assign')
  , IndexView = require('./index')
  , FullView = require('./full')
  , EditView = require('./edit')
  , DeleteView = require('./delete')
  , Collection = require('./collection')
  , Model = require('./model')
  , widgets = new Collection();

app.router.route('widget', 'page', function() {
  app.trigger('page', new IndexView({ model: app.me, collection: widgets }));
});

app.router.route('widget/:slug', 'page', function(slug) {
  widgets.getOrFetch(slug, function(err, model) {
    if (err) return console.error(err);
    app.trigger('page', new FullView({ model: model }));
  });
});

app.router.route('widget/:slug/edit', 'page', function(slug) {
  widgets.getOrFetch(slug, function(err, model) {
    if (err) return console.error(err);
    app.trigger('page', new EditView({ model: model }));
  });
});

app.router.route('widget/:slug/delete', 'page', function(slug) {
  widgets.getOrFetch(slug, function(err, model) {
    if (err) return console.error(err);
    app.trigger('page', new DeleteView({ model: model }));
  });
});

app.router.route('widget/new', 'page', function() {
  app.trigger('page', new EditView({ model: new Model() }));
});

