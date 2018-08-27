Template.indexFlash.created = function() {
  this.flashTimeout = null;
};

Template.indexFlash.destroyed = function() {
  Session.set('flash', null);
  if (this.flashTimeout) {
    Meteor.clearTimeout(this.flashTimeout);
  }
};

Template.indexFlash.flash = function() {
  var flashMsg = Session.get('flash');
  if (flashMsg) {
    _.defer(function() {
      $('.flash').hide();
    });
    _.delay(function() {
      $('.header').addClass('with-flash');
      $('.flash').fadeIn();
    }, 350);
    if (this.flashTimeout) {
      Meteor.clearTimeout(this.flashTimeout);
    }
    this.flashTimeout = Meteor.setTimeout(function() {
      $('.flash').fadeOut(function() {
        Session.set('flash', null);
        $('.header').removeClass('with-flash');
      });
    }, 4500);
  }
  return flashMsg;
};