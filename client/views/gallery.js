Template.gallery.created = function() {
  this._subscription = Meteor.subscribe("canvases");
  $('body').addClass('body-gallery');
};

Template.gallery.destroyed = function() {
  $('body').removeClass('body-gallery');
  this._subscription.stop();
};

Template.gallery.rendered = function() {
  $('.header-logo').show();
};

Template.gallery.canvases = function() {
  return Canvases.find({}, { sort: { createdAt: -1 }, limit: 21 }).fetch();
};

var dynamicCanvasData = new DynamicCanvasData();
Template.canvasListItem.rendered = function() {
  var canvasId = this.data.canvasId,
      $bgImg = $(this.firstNode).find('.gallery-canvas-bg');

  // We'll need to check whether or not to expire the cache
  // Usually, the only time needing to expire is when a new
  // canvas is added
  if (dynamicCanvasData.isStale(canvasId)) {
    dynamicCanvasData.expire();
  }

  dynamicCanvasData.fetch(function(data) {
    var lastSave = data[canvasId].lastSave;
    var lastPaint = data[canvasId].lastPaint;
  	if (WTPImage.isCanvasStale(lastSave, lastPaint)) {
      Meteor.call('createPNG', canvasId, function() {
      	$bgImg.smartBackgroundImage('https://' + Meteor.settings.public.s3Bucket + '.s3.amazonaws.com/images/512/' + canvasId + '.png');
      });
  	} else {
      $bgImg.smartBackgroundImage('https://' + Meteor.settings.public.s3Bucket + '.s3.amazonaws.com/images/512/' + canvasId + '.png');
  	}
  });
};

Template.gallery.events = {
  'click [href]': function(e, T) {
    e.preventDefault();
    Backbone.history.navigate($(e.currentTarget).attr('href'), true);
  }
};
