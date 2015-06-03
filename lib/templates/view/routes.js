var app = require('ampersand-app')
  , extend = require('lodash.assign')
  , IndexView = require('./index')
  , FullView = require('./full')
  , EditView = require('./edit')
  , DeleteView = require('./delete')
  , Collection = require('./collection')
  , Model = require('./model')
  , collection = new Collection();

module.exports = function plugin(router) {

  router.route('{{name}}', 'page', function() {
    app.trigger('page', new IndexView({ model: app.me, collection: collection }));
  });

  router.route('{{name}}/:id', 'page', function(id) {
    collection.getOrFetch(Number(id), function(err, model) {
      if (err) return console.error(err);
      app.trigger('page', new FullView({ model: model }));
    });
  });

  router.route('{{name}}/:id/edit', 'page', function(id) {
    collection.getOrFetch(Number(id), function(err, model) {
      if (err) return console.error(err);
      app.trigger('page', new EditView({ model: model }));
    });
  });

  router.route('{{name}}/:id/delete', 'page', function(id) {
    collection.getOrFetch(Number(id), function(err, model) {
      if (err) return console.error(err);
      app.trigger('page', new DeleteView({ model: model }));
    });
  });

  router.route('{{name}}/new', 'page', function() {
    app.trigger('page', new EditView({ model: new Model() }));
  });

}
