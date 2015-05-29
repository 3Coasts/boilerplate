var app = require('ampersand-app')
  , extend = require('lodash.assign')
  , IndexView = require('./index')
  , FullView = require('./full')
  , EditView = require('./edit')
  , DeleteView = require('./delete')
  , Collection = require('./collection')
  , Model = require('./model')
  , articles = new Collection();

app.router.route('blog', 'page', function() {
  app.trigger('page', new IndexView({ model: app.me, collection: articles }));
});

app.router.route('blog/:slug', 'page', function(slug) {
  articles.getOrFetch(slug, function(err, model) {
    if (err) return console.error(err);
    app.trigger('page', new FullView({ model: model }));
  });
});

app.router.route('blog/:slug/edit', 'page', function(slug) {
  articles.getOrFetch(slug, function(err, model) {
    if (err) return console.error(err);
    app.trigger('page', new EditView({ model: model }));
  });
});

app.router.route('blog/:slug/delete', 'page', function(slug) {
  articles.getOrFetch(slug, function(err, model) {
    if (err) return console.error(err);
    app.trigger('page', new DeleteView({ model: model }));
  });
});

app.router.route('blog/new', 'page', function() {
  app.trigger('page', new EditView({ model: new Model() }));
});

