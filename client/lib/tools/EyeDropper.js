EyeDropper = Class.extend({
  init: function($el, args) {
    this.$el = $el;
    this.activated = false;
  },
  $el: function() {
    return this.$el;
  },
  isActivated: function() {
    return this.activated;
  },
  activate: function() {
    this.activated = true;
    this.$el.toggleClass('selected', this.activated);
  },
  deactivate: function() {
    this.activated = false;
    this.$el.toggleClass('selected', this.activated);
  },
  toggle: function() {
    this.activated = !this.activated;
    this.$el.toggleClass('selected', this.activated);
  }
});