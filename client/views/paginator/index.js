var View = require('ampersand-view')
  , Page = require('./page')
  , Pages = require('./collection')
  , html = require('./index.html');

module.exports = View.extend({
  template: html,
  bindings: {
    disablePrevious: { type: 'booleanClass', name: 'unavailable-item', hook: 'previous' },
    disableNext: { type: 'booleanClass', name: 'unavailable-item', hook: 'next' }
  },
  events: {
    'click [data-hook=previous]': 'previousClick',
    'click [data-hook=next]': 'nextClick'
  },
  props: {
    count: { type: 'number', default: 0 },
    limit: { type: 'number', default: 10 },
    skip: { type: 'number', default: 0 }
  },
  derived: {
    totalPages: {
      deps: ['count', 'limit'],
      cache: false,
      fn: function() {
        return Math.ceil(this.count / this.limit);
      }
    },
    currentPage: {
      deps: ['skip', 'limit'],
      fn: function() {
        return this.skip === 0 ? 1 : this.skip / this.limit + 1;
      }
    },
    disableNext: {
      deps: ['count', 'limit', 'skip'],
      fn: function() {
        return this.currentPage === this.totalPages || this.totalPages === 0;
      }
    },
    disablePrevious: {
      deps: ['limit', 'skip'],
      fn: function() {
        return this.currentPage === 1;
      }
    }
  },
  initialize: function() {
    this.collection = new Pages();
    this.on('change:count', this.updatePages);
    this.on('change:skip', this.updatePages);
  },
  render: function() {
    this.renderWithTemplate();
    this.renderCollection(this.collection, Page, this.queryByHook('pages'));
    this.updatePages();
  },
  updatePages: function() {
    this.collection.reset();
    for (var x = 1; x <= this.totalPages; x++)
      this.collection.add({ number: x, current: this.skip / this.limit + 1 === x });
  },
  numberClick: function(number) {
    this.skip = (number - 1) * this.limit;
  },
  nextClick: function() {
    if (this.disableNext) return;
    this.skip = this.currentPage * this.limit;
  },
  previousClick: function() {
    if (this.disablePrevious) return;
    this.skip = (this.currentPage - 2) * this.limit;
  }
});