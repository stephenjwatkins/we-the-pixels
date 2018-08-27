Tools = Class.extend({
  init: function(tools) {
    this._tools = {};
    if (tools) {
      for (var key in tools) {
        this.add(key, tools[key]);
      }
    }
  },
  deactivate: function() {
    for (var key in this._tools) {
      this._tools[key].deactivate();
    }
    return this;
  },
  add: function(key, tool) {
    this._tools[key] = tool;
    return this;
  },
  has: function(key) {
    return !!this._tools[key];
  },
  at: function(key) {
    return this._tools[key];
  },
  all: function() {
    return this._tools;
  }
});