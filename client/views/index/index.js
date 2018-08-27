Template.index.created = function() {
  this._transitionOutPage = function(cb) {
    $('.overlay').animate({ opacity: 0 }, 350, function() {
      $('.canvas-wrapper, .shade').animate({ opacity: 0 }, 1000, cb);
    });
  };
  this._transitionOutPageContent = function(cb) {
    $('.content').animate({ opacity: 0 }, 150, cb);
  };
};

Template.index.events({

  // Handle transitioning to another page
  'click [rel="transition-page"][href]': function(e, T) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(e.currentTarget),
        href = $this.attr('href');

    T._transitionOutPage(function() {
      Backbone.history.navigate(href, true);
    });
  },

  // Handle transitioning to another content section on index page
  'click [rel="transition-content"][href]': function(e, T) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(e.currentTarget),
        href = $this.attr('href'),
        section = (href == '/') ? 'home' : href.substring(1);

    // Back out if we're already in the same section
    if (Session.equals('indexSection', section)) {
      return;
    }

    T._transitionOutPageContent(function() {
      Backbone.history.navigate(href, true);
    });
  },

  // Of course, handle the logging out, redirect home?
  'click [href="/account/logout"]': function(e, T) {
    e.preventDefault();
    e.stopPropagation();

    Meteor.logout(function() {
      Session.set('flash', 'Logged out successfully.');
      Backbone.history.navigate('/', true);
    });
  },

  'click [href="/gallery"]': function(e, T) {
    e.preventDefault();
    e.stopPropagation();
    Backbone.history.navigate($(e.currentTarget).attr('href'), true);
  },

  'click .paint-now': function(e, T) {
    e.preventDefault();
    e.stopPropagation();

    Backbone.history.navigate($(e.currentTarget).attr('href'), true);
  }

});