var ActionQueue = [];

Template.canvasBody.created = function() {

  var T = this;
 
  T._handleResize = function() {
    T._baseLayer.resize();
    T._gridLayer.resize(); // !NOTE depends on baseLayer.resize happening first

    T._$canvasContainer.css({
      width: T._baseLayer.canvas.width,
      height: T._baseLayer.canvas.height
    });
  };

  T._getPixelCoordinate = function(actual) {
    return Math.floor(actual / T._baseLayer.pixelSize);
  };

  T._processActionQueue = _.throttle(function() {
    var actionSets = _.groupBy(ActionQueue, function(action) { return action.action; })
    if (actionSets.erase) {
      var erases = _.map(actionSets.erase, function(action) { return action.args; });
      Meteor.call('eraseBatch', erases, canvasLifeManager.lifeKey);
    }
    if (actionSets.paint) {
      var paints = _.map(actionSets.paint, function(action) { return action.args; });
      Meteor.call('paintBatch', paints, canvasLifeManager.lifeKey);
    }
    ActionQueue = [];
  }, 500);

  $(window).on('resize', T._handleResize);

};

Template.canvasBody.destroyed = function() {

  $(window).off('resize', this._handleResize);
  this._observer.stop();
  this._subscription.stop();

};

Template.canvasBody.rendered = function() {

  var T = this;
  T._canvasId = Session.get('appCanvasId');

  if (!T._canvasId) {
    return;
  }

  var $canvas = $('#canvas'),
      $gridCanvas = $('#grid-canvas'),
      $canvasPage = $('.canvas-page'),
      $canvasContainer = T._$canvasContainer = $('.canvas-container'),
      $canvasWrapper = $('.canvas-wrapper');

  T._baseLayer = new basePixelLayer(T._canvasId, $canvas[0], 45, 80, 'contain', $canvasWrapper, 0);
  T._gridLayer = new gridPixelLayer($gridCanvas[0], T._baseLayer);

  $canvasContainer.css({
    width: T._baseLayer.canvas.width,
    height: T._baseLayer.canvas.height,
    'min-width': T._baseLayer.cols * 10,
    'min-height': T._baseLayer.rows * 10
  });

  T._subscription = Meteor.subscribe("pixels-by-canvas", T._canvasId, function() {

    canvasDoneLoading = true;

    T._observer = CurrentPaints.find({ canvasId: T._canvasId }).observe({
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

var previousLuma;

Template.canvasBody.events({

  'mousemove #grid-canvas': function(e, T) {

    var hasOffset = e.hasOwnProperty('offsetX'),
        x         = hasOffset ? e.offsetX : e.layerX,
        y         = hasOffset ? e.offsetY : e.layerY;

    var xPixel = T._getPixelCoordinate(x),
        yPixel = T._getPixelCoordinate(y);

    if (xPixel != T._gridLayer.hoverPixelX || yPixel != T._gridLayer.hoverPixelY) {
      T._gridLayer.hoverPixelX = xPixel;
      T._gridLayer.hoverPixelY = yPixel;
      T._gridLayer.repaint();
    }

  },

  'mouseenter #grid-canvas': function(e, T) {
    T._gridLayer.hovering = true;
  },

  'mouseleave #grid-canvas': function(e, T) {
    T._gridLayer.hovering = false;
    T._gridLayer.hoverPixelX = null;
    T._gridLayer.hoverPixelY = null;
    T._gridLayer.repaint();
  },

  'mousemove .canvas' : function(e, T) {
    var hasOffset = e.hasOwnProperty('offsetX'),
        x         = hasOffset ? e.offsetX : e.layerX,
        y         = hasOffset ? e.offsetY : e.layerY;

    var pixelData = T._baseLayer.canvas.graphics.getImageData(x, y, 1, 1).data;

    if (!pixelData[3]) {
      if (previousLuma != 'light') {
        T._$canvasContainer.removeClass('dark-pixel light-pixel').addClass('light-pixel');
        previousLuma = 'light';
      }
      return;
    }

    if (ColorUtil.isDarkColor(pixelData[0], pixelData[1], pixelData[2])) {
      if (previousLuma != 'dark') {
        T._$canvasContainer.removeClass('dark-pixel light-pixel').addClass('dark-pixel');
        previousLuma = 'dark';
      }
    } else {
      if (previousLuma != 'light') {
        T._$canvasContainer.removeClass('dark-pixel light-pixel').addClass('light-pixel');
        previousLuma = 'light';
      }
    }
  },

  'click .canvas' : function(e, T) {
    e.preventDefault();


    var hasOffset = e.hasOwnProperty('offsetX'),
        x         = hasOffset ? e.offsetX : e.layerX,
        y         = hasOffset ? e.offsetY : e.layerY;

    var pixelData = T._baseLayer.canvas.graphics.getImageData(x, y, 1, 1).data;

    if (CanvasTools.at('d').isActivated()) {
      if (!pixelData[3]) {
        Session.set('tool', 'e');
      } else {
        CanvasTools.at('c').args.$el.spectrum('set', 'rgb(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ')');
        Session.set('tool', 'c');
      }
      return;
    }

    var xPixel = T._getPixelCoordinate(x),
        yPixel = T._getPixelCoordinate(y);

    var color = CanvasTools.at('c').color(),
        rgbColor = color.toRgb(),
        hexColor = color.toHexString();

    if (CanvasTools.at('e').isActivated()) {
      if (pixelData[3] && Meteor.user()) {
        T._baseLayer.erasePixel(xPixel, yPixel);
        ActionQueue.push({
          action: 'erase',
          args: {
            canvasId: T._canvasId,
            xPixel: xPixel,
            yPixel: yPixel
          }
        });
        T._processActionQueue();
      } else {
        Session.set('flash', 'go log in, you potential troll!');
      }
      return;
    }

    if (!pixelData[3]) {
      addToActionQueue(xPixel, yPixel, hexColor, T);
    } else if ((rgbColor.r != pixelData[0]) || 
               (rgbColor.g != pixelData[1]) ||
               (rgbColor.b != pixelData[2])) {
      if (Meteor.user()) {
        addToActionQueue(xPixel, yPixel, hexColor, T);
      } else {
        Session.set('flash', 'go log in, you potential troll!');
      }
    }
    return;
  }

});

addToActionQueue = function (xPixel, yPixel, hexColor, T) {

  T._baseLayer.drawPixel(xPixel, yPixel, hexColor);
  ActionQueue.push({
    action: 'paint',
    args: {
      canvasId: T._canvasId,
      xPixel: xPixel,
      yPixel: yPixel,
      hexColor: hexColor
    }
  });
  T._processActionQueue();
}