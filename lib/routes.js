var fs = require('fs')
  , config = require('./config')
  , resourceFiles = fs.readdirSync(__dirname + '/../routes')
  , camel = require('lodash.camelcase')
  , routesJSON = require('../routes.json')
  , passport = require('./passport')
  , routes = [];

resourceFiles.forEach(function (file) {
  if (file.split('.').pop() !== 'js') { return; }
  var fileName = file.split('.').shift();
  routes[camel(fileName)] = require('../routes/' + fileName);
});

function buildHandler(method, path) {
  var handler = method;
  path = path.split('/');
  if (!path.length) throw new Error('Bad Route');
  var file = path.shift();
  if (!path.length) return routes[file][handler];
  for (var x in path) {
    path[x] = path[x].replace(/\W+/g, "");
    path[x] = path[x].charAt(0).toUpperCase() + path[x].slice(1);
  }
  handler += path.join();
  return routes[file][handler];
}

module.exports = function (app) {
  routesJSON.forEach(function (item) {
    var args = ['/api/v' + config.version + '/' + item.path];
    if (item.protect) args.push(passport.authenticate('bearer', {session: false}));
    args.push(buildHandler(item.method, item.path));
    app[item.method].apply(app, args);
    if (item.method === 'put') app['patch'](app, args); // I like to make updates patchable
  });
};


