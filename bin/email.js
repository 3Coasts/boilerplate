var config = require('./config'),
  AWS = require('aws-sdk'),
  async = require('async'),
  jade = require('jade'),
  isArray = require('amp-is-array'),
  isObject = require('amp-is-object'),
  isFunction = require('amp-is-function'),
  isNumber = require('amp-is-number'),
  filter = require('amp-filter'),
  each = require('amp-each');

var ses = new AWS.SES({
  credentials: {
    accessKeyId: config.s3key,
    secretAccessKey: config.s3secret
  },
  region: 'us-east-1'
});

module.exports = function (email, cb) {
  var models = require('./models');

  var args = email;
  if (!isArray(args.users)) { args.users = [args.users]; }

  args.baseUrl = config.protocol + '://' + config.host;
  var content = jade.renderFile(__dirname + '/../jade/emails/' + args.type + '.jade', args);

  async.map(args.users, function (user, cb) {
    // Is a user object with name and email
    if (isObject(user) && user.email) {
      return cb(null, user);
    }
    // Is a number and need to get user object
    if (isNumber(user)) {
      models.User.find({ where: { id: user } }).success(function (user) {
        return cb(null, user);
      }).error(cb);
    }
  }, function (err, results) {

    // add email for users
    var tasks = [];
    each(results, function (user){
      var name = [];
      if (user.firstName) { name.push(user.firstName); }
      if (user.lastName) { name.push(user.lastName); }
      tasks.push(function (cb) {
        if (config.isDev && !config.email) {
          console.log(args);
          return cb(null);
        }
        ses.sendEmail({
          Destination: { ToAddresses: [name.join(' ') + ' <' + user.email + '>'] },
          Message: {
            Body: { Html: { Data: content } },
            Subject: { Data: args.subject }
          },
          Source: 'GradSquare <info@gradsquare.com>'
        }, cb);
      });
    });

    async.parallel(tasks, function (err, results) {
      if (!isFunction(cb)) { return; }
      return cb(err, results);
    });

  });
};