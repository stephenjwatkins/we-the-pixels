Template.bgCanvas.created = function() {

  var T = this;

  T._centerCanvas = function() {
    $('.bg-canvas-container').css({
      top: -((T._baseLayer.canvas.height - $(window).height()) / 2),
      left: -((T._baseLayer.canvas.width - $(window).width()) / 2),
      bottom: 'auto',
      right: 'auto',
      width: T._baseLayer.canvas.width,
      height: T._baseLayer.canvas.height
    });
  };

  T._handleResize = function() {
    T._baseLayer.resize();
    T._centerCanvas();
  };

  $(window).on('resize', T._handleResize);

};

Template.bgCanvas.destroyed = function() {

  $(window).off('resize', this._handleResize);
  this._subscription.stop();

};

Template.bgCanvas.rendered = function() {

  var T = this,
      canvasId = Session.get('bgCanvas'),
      $canvasWrapper = $('.bg-canvas-wrapper'),
      $loadingMsg = $('<span class="loading-canvas">Loading canvas...</span>').appendTo($('.header-right'));

  T._baseLayer = new basePixelLayer(canvasId, $('.bg-base-layer-canvas')[0], 45, 80, 'cover', $canvasWrapper);
  T._centerCanvas();

  T._subscription = Meteor.subscribe("pixels-by-canvas", canvasId, function() {

    // Fade in the canvas as soon as the data is here
    $canvasWrapper.animate({ opacity: 1 }, 1500);
    $loadingMsg.fadeOut(function() {
      $(this).remove();
    });

    // Adjust canvas based on changes coming in
    T._observer = CurrentPaints.find({ canvasId: canvasId }).observe({
      added: function (newPaint) {
        T._baseLayer.drawPixel(newPaint.x, newPaint.y, newPaint.color);
      },
      changed: function (newPaint, oldPaint) {
        T._baseLayer.drawPixel(newPaint.x, newPaint.y, newPaint.color);
      },
      removed: function (oldPaint) {
        T._baseLayer.erasePixel(oldPaint.x, oldPaint.y);
      }
    });

  });

};