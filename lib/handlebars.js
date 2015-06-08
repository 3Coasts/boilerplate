var Handlebars = require('handlebars');

Handlebars.registerHelper('ifOr', function(v1, v2, options) {
  if (v1 || v2)
    return options.fn(this);
  return options.inverse(this);
});

Handlebars.registerHelper('unlessOr', function(v1, v2, options) {
  if (!v1 || !v2)
    return options.fn(this);
  return options.inverse(this);
});

Handlebars.registerHelper('ifAnd', function(v1, v2, options) {
  if (v1 && v2)
    return options.fn(this);
  return options.inverse(this);
});

Handlebars.registerHelper('unlessAnd', function(v1, v2, options) {
  if (!v1 && !v2)
    return options.fn(this);
  return options.inverse(this);
});

module.exports = Handlebars;