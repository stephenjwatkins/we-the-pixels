Template.canvasHeader.subject = function() {
  var canvas = Session.get('appCanvas');
  if (canvas && canvas.subject) {
    return canvas.subject;
  }
  return '';
};

Template.canvasHeader.owner = function() {
  var canvas = Session.get('appCanvas'),
      owner = Session.get('canvasOwner');
  if (!canvas) {
    return;
  }
  Meteor.call('getOwnerAccountFromId', canvas.owner, function(err, owner) {
    Session.set('canvasOwner', owner);
  });
  if (!owner) {
    return;
  }  
  return owner.username;
};

Template.canvasHeader.share = function() {
  var canvas = Session.get('appCanvas');
  if (!canvas) {
    return '';
  }
  return {
    url: Meteor.absoluteUrl('canvas/' + canvas.canvasId),
    title: 'Help paint ' + canvas.subject + ' on We the Pixels!',
    text: 'Help your friends paint ' + canvas.subject + ' on We the Pixels, a real-time collaborative pixel art platform.'
  };
};

Template.canvasHeader.events({
  'click .back-icon': function(e, T) {
    e.preventDefault(); 

    // If they came from the gallery, go to the gallery.
    // Otherwise, go home.
    var toUrl = '';
    if (RouteHistory.length > 1) {
      var lastRoute = RouteHistory[RouteHistory.length - 2];
      if (lastRoute.route == 'gallery') {
        toUrl = lastRoute.fragment;
      }
    }
    Backbone.history.navigate(toUrl, true);
  },
  'click .canvas-sharing': function(e, T) {
    e.preventDefault();

    $(e.currentTarget).toggleClass('active');
  },
  'click .canvas-sharing-list-item a': function(e, T) {
    e.stopPropagation();
  }
});

Template.canvasHeader.created = function() {

  this._updateArtistCount = function() {
    var canvasId = Session.get('appCanvasId'),
        totalArtistCount = Lives.find({ topic: canvasId }).count(),
        idleArtistCount = Lives.find({ topic: canvasId, key: { $ne: canvasLifeManager.lifeKey }, idle: true }).count(),
        otherArtistCount = totalArtistCount - 1;

    $('.artist-count .count').text(totalArtistCount);

    // We could do more here with the idle count
  };

};

Template.canvasHeader.destroyed = function() {
  Session.set('canvasOwner', null);
  if (this._observer) {
    this._observer.stop();
  }
};

Template.canvasHeader.rendered = function() {

  // Create the loading indicator
  var spinner = new Spinner({
    lines: 8,
    length: 2,
    width: 3,
    radius: 4,
    color: '#555',
    speed: 1,
    trail: 30,
  }).spin($('.canvas-header-right .loading')[0]);

  var canvasId = Session.get('appCanvasId');
  if (!canvasId) {
    return;
  }

  var loadingInterval = Meteor.setInterval(function() {
    if (canvasDoneLoading) {
      $('.canvas-header-right .loading').fadeOut();
      Meteor.clearInterval(loadingInterval);
    }
  }, 100);

  var T = this;
  if (!this._observer) {
    this._observer = Lives.find({ topic: canvasId }).observe({
      added: function (newArtist) {
        T._updateArtistCount();
      },
      changed: function(newArtist, oldArtist) {
        T._updateArtistCount();
      },
      removed: function (oldArtist) {
        T._updateArtistCount();
      }
    });
  }
};
