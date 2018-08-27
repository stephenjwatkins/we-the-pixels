Template.bg.created = function() {

  var T = this;
  Deps.autorun(function() {
    if (Session.get('disableBg')) {
      if (T._paintsComputation) {
        T._paintsComputation.stop();
      }
      if (T._subscription) {
        T._subscription.stop();
      }
      return;
    }
    T._subscription = Meteor.subscribe('latest-featured-paint', function() {
      Deps.autorun(function(c) {
        T._paintsComputation = c;
        var newPaint = AllPaints.find({}, {
          sort: { date: -1 },
          limit: 1
        }).fetch()[0];
        
        if (newPaint && newPaint.color) {
          $('.bg').css('background-color', newPaint.color);
        }
      });
    });
  });

};

Template.bg.destroyed = function() {
  this._paintsComputation.stop();
  this._subscription.stop();
}
