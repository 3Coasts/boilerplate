var View = require('ampersand-view')
  , each = require('lodash.foreach')
  , find = require('lodash.findwhere')
  , html = require('./search.html');

var ItemView = View.extend({
  template: '<li></li>',
  events: {
    click: 'select'
  },
  props: {
    active: { type: 'boolean', default: 0 }
  },
  bindings: {
    'model.name': { type: 'text' },
    active: { type: 'booleanClass', name: 'active' }
  },
  select: function(e) {
    this.parent.show = false;
    this.parent.select(this.model);
  }
})


module.exports = View.extend({
  template: html,

  render: function() {
    var view = this;
    view.renderWithTemplate();
    view.items = view.renderCollection(view.collection, ItemView, view.queryByHook('options'));
    view.currentText = view.model[view.property];
  },

  events: {
    'keyup input': 'keyup',
    'keydown input': 'keydown',
    'blur input': 'blur'
  },

  bindings: {
    show: { type: 'toggle', hook: 'options' },
    label: { type: 'text', hook: 'label' },
    currentText: { type: 'attribute', name: 'value', hook: 'input' }
  },

  props: {
    currentText: { type: 'string' },
    currentIndex: { type: 'number', default: 0 },
    show: { type: 'boolean' },
    label: { type: 'string' },
    property: { type: 'string' }
  },

  keydown: function(e) {
    var view = this;
    if (e.keyCode == 38) return view.move(-1);
    if (e.keyCode == 40) return view.move(+1);
    if (e.keyCode == 13) return view.onEnter(e);
    if (e.keyCode == 27) return view.show = false;
  },

  keyup: function(e) {
    var view = this;
    var keyword = e.target.value;
    if (view.isChanged(keyword)) {
      if (view.isValid(keyword))
        view.filter(keyword);
      else
        view.show = false;
      view.currentText = keyword;
    }
  },

  blur: function() {
    this.show = false;
  },

  move: function(position) {
    var view = this;
    var max = view.collection.length;
    if (view.currentIndex === 0 && position === -1)
      return
    if (view.currentIndex === max && position === 1)
      return
    view.currentIndex += position
    each(view.items.views, function(subview, index) {
      subview.active = view.currentIndex === (index + 1);
    })
  },

  select: function(model) {
    var view = this;
    view.show = false;
    view.model = model;
    view.currentText = view.queryByHook('input').value = view.model.name;
  },

  onEnter: function(e) {
    e.preventDefault();
    var view = this;
    var subview = find(view.items.views, { active: true });
    view.select(subview.model);
    return false;
  },

  isChanged: function(keyword) {
    return this.currentText != keyword;
  },

  filter: function(keyword) {
    var view = this;
    var fetchParams = { data: {} };
    fetchParams.data['name'] = keyword.toLowerCase();
    fetchParams.success = function() {
      view.show = true;
    }
    view.collection.fetch(fetchParams);
  },

  isValid: function(keyword) {
    return keyword.length > 0
  }

})