var routes = require('./bin/routes');

module.exports = [

  /*PARAMS*/
  { method: 'param', path: 'user', callbacks: [routes.user.param] },

  /*USER*/
  { method: 'post', path: '/api/user', callbacks: [routes.user.add] },
  //{ method: 'post', path: '/api/user/login', callbacks: [routes.user.login] },
  //{ method: 'get', path: '/api/user/logout', callbacks: [routes.user.logout] },
  //{ method: 'post', path: '/api/user/reset', callbacks: [routes.user.reset] },
  { method: 'get', path: '/api/user/:user', callbacks: [routes.user.get] },
  { method: 'put', path: '/api/user/:user', protect: [3, 'update'], callbacks: [routes.user.update] },
  //{ method: 'post', path: '/api/user/:user/password', callbacks: [routes.user.password] }

  { method: 'get', path: '/browser', callbacks: [routes.client.browser] },
  { method: 'get', path: '*', callbacks: [routes.client.send] }

];