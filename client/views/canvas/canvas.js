canvasLifeManager = null;
canvasDoneLoading = false;

Template.canvas.created = function() {

  var T = this;

  canvasDoneLoading = false;

  // If the canvas ever changes, let's reinit it.
  Deps.autorun(function(autorunInst) {

    var canvasId = Session.get('appCanvasId');
    if (!canvasId) {
      return;
    }

    // Stop any previous subscriptions
    if (T._subscription) {
      T._subscription.stop();
      canvasLifeManager.stop();
    }

    // Subscribe to current canvas info
    T._subscription = Meteor.subscribe('canvas', canvasId, function() {

      // TODO: Fix this, for some reason M needs this here or else will restart
      // autorun instance.
      autorunInst.stop();

      var canvas = Canvases.findOne({ canvasId: canvasId }),
          subject = (canvas && canvas.subject) ? canvas.subject + ' - ' : '';
      
      Util.title(subject + 'Canvas');
      Util.description('Help your friends paint ' + canvas.subject + ' on We the Pixels, a real-time, collaborative pixel art platform.');
      Session.set('appCanvas', canvas);

      canvasLifeManager = new CanvasLifeManager(canvasId);
      canvasLifeManager.start();
    });

  });

  T._handleColorPickerChange = function(color) {
    Session.set('tool', 'c');
  };

  T._handleKeyup = function(e) {
    Session.set('tool', String.fromCharCode(e.keyCode).toLowerCase());
  };

  $(document).on('keyup', T._handleKeyup);
  document.onselectstart = function() {
    return false;
  };

};

Template.canvas.rendered = function() {
  var T = this,
      canvasId = Session.get('appCanvasId');
  if (!canvasId) {
    return;
  }

  $('[data-tooltip]').tooltip();

  // Setup tools
  T._tools = CanvasTools = new Tools({
    'e': new Eraser($('.eraser')),
    'd': new EyeDropper($('.eye-dropper')),
    'c': new ColorPicker($('.cp-icon'), {
      $el: $('.cp-input'),
      color: '#000000',
      localStorageKey: "spectrum.canvas." + canvasId.toString(),
      change: T._handleColorPickerChange,
      show: T._handleColorPickerChange
    })
  });

  Deps.autorun(function() {
    var tool = Session.get('tool');
    if (T._tools.has(tool)) {
      $('.canvas-container').removeClass('tool-e-cursor tool-d-cursor tool-c-cursor').addClass('tool-' + tool + '-cursor');
      T._tools.deactivate().at(tool).activate();
    }
  });
  Session.set('tool', 'c');

};

Template.canvas.destroyed = function() {
  $(document).off('keyup', this._handleKeyup);
  // Destroy the color picker
  _.delay(function() {
    CanvasTools.at('c').destroy();
    CanvasTools = undefined;
  }, 100);
  this._subscription.stop();
  Session.set('appCanvas', null);
  Session.set('appCanvasId', null);
  canvasLifeManager.stop();
  document.onselectstart = function() {
    return true;
  };
};

Template.canvas.events({
  'click .cp-icon': function(e) {
    Session.set('tool', 'c');
  },
  'click .eye-dropper' : function(e) {
    Session.set('tool', 'd');
  },
  'click .eraser' : function(e) {
    Session.set('tool', 'e');
  }
});