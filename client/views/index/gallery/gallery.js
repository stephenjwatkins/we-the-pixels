Template.indexGallery.destroyed = function() {
  this._subscription.stop();
};

Template.indexGallery.rendered = function() {

  // Subscribe to make sure we have the canvases here.
  // Even though, if they click the gallery first, then they
  // probably will already have the Canvases needed
  this._subscription = Meteor.subscribe("home-gallery-canvases", function() {

    // Sort canvases by date
    var canvases = Canvases.find({}, {
      sort: { createdAt: -1 },
      limit: 6
    }).fetch();

    for (var i = 0; i < Math.min(canvases.length, 6); i++) {
      var canvas = canvases[i],
          $item = $('<li class="gallery-list-item"></li>');

      $('.gallery-list').append($item);

      if (WTPImage.isCanvasStale(canvas.lastSave, canvas.lastPaint)) {
        Meteor.call('createPNG', canvas.canvasId, function() {
          $item.smartBackgroundImage('https://' + Meteor.settings.public.s3Bucket + '.s3.amazonaws.com/images/128/' + canvas.canvasId + '.png');
        });
      } else {
        $item.smartBackgroundImage('https://' + Meteor.settings.public.s3Bucket + '.s3.amazonaws.com/images/128/' + canvas.canvasId + '.png');
      }
    }
  });
};

Template.indexGallery.events({
  'mouseenter .gallery-list': function(e, T) {
    $('.gallery-invitation').addClass('hover');
  },
  'mouseleave .gallery-list': function(e, T) {
    $('.gallery-invitation').removeClass('hover');
  },
  'mouseenter .gallery-text': function(e, T) {
    $('.gallery-invitation').addClass('hover');
  },
  'mouseleave .gallery-text': function(e, T) {
    $('.gallery-invitation').removeClass('hover');
  }
});