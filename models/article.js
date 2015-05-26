var Model = require('../lib/model');

module.exports = new Model({
  props: {
    title: { type: String },
    summary: { type: String },
    body: { type: String }
  },
  slug: 'title'
});