var jade = require('jade');

exports.browser = function (req, res, next) {
  console.log('test');
  res.send(200);
};

exports.send = function(req, res, next) {
  var content = jade.renderFile(__dirname + '/../jade/client.jade');
  res.send(content);
};

