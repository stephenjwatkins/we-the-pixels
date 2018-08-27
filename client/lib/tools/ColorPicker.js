ColorPicker = Class.extend({
  init: function($el, args) {
    this.$el = $el;
    this.args = args;
    this.activated = false;

    var defaults = {
      color: 'white',
      showButtons: false,
      preferredFormat: "hex6",
      showInput: true,
      showPalette: true,
      showSelectionPalette: true,
      palette: [
        ['black', 'white'],
        ['red', 'green'],
        ['blue', 'yellow']
      ],
      clickoutFiresChange: true
    };

    var settings = $.extend({}, defaults, args);
    this.args.$el.spectrum(settings);
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
    this.$el.parent().toggleClass('selected', this.activated);
    return this;
  },
  deactivate: function() {
    this.activated = false;
    this.$el.toggleClass('selected', this.activated);
    this.$el.parent().toggleClass('selected', this.activated);
    return this;
  },
  toggle: function() {
    this.activated = !this.activated;
    this.$el.toggleClass('selected', this.activated);
    this.$el.parent().toggleClass('selected', this.activated);
    this.args.$el.spectrum( (this.activated) ? 'show' : 'hide' );
    return this;
  },
  color: function() {
    return this.args.$el.spectrum('get');
  },
  destroy: function() {
    this.args.$el.spectrum('destroy');
  }
});