DynamicCanvasData = Class.extend({
  init: function() {
    this.cache = null;
    this.fetching = false;
    this.cbQueue = [];
  },
  fetch: function(cb) {
    this.cbQueue.push(cb);
    if (this.cache) {
      this.fetched();
      return;
    }
    if (this.fetching) {
      return;
    }
    this.fetching = true;
    var self = this;
    Meteor.call('getCanvasesDynamicData', function(error, result) {
      self.fetching = false;
      if (!error) {
        self.cache = result;
        self.fetched();
      } else {
        console.log(error);
      }
    });
  },
  fetched: function() {
    _.each(this.cbQueue, _.bind(function(cb) {
      cb(this.cache);
    }, this));
    this.cbQueue = [];
  },
  expire: function() {
    this.cache = null;
  },
  isStale: function(canvasId) {
    return !this.cache || (canvasId && !this.cache[canvasId]);
  }
});