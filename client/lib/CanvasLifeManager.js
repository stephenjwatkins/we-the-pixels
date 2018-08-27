CanvasLifeManager = Class.extend({
  init: function(canvasId) {
    this.lifeKey = this._lifeKey();
    this.topic = canvasId;
  },
  _lifeKey: function() {
    if (Meteor.userId()) {
      return Meteor.userId();
    }
    return store.get('sessionId');
  },
  start: function() {
    this.issueActivity();
    this.issueHeartbeat();

    this.livesSubscription = Meteor.subscribe("lives", this.topic);
    this.heartbeatInterval = Meteor.setInterval(_.bind(function() {
      this.issueHeartbeat();
    }, this), 4250);
  },
  stop: function() {
    Meteor.clearInterval(this.heartbeatInterval);
    this.livesSubscription.stop();
  },
  issueHeartbeat: function() {
    Meteor.call('sendLifeHeartbeat', this.topic, this.lifeKey);
  },
  issueActivity: function() {
    Meteor.call('sendLifeActivity', this.topic, this.lifeKey);
  }
});