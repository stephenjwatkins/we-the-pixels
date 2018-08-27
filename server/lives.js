Meteor.startup(function() {
  Meteor.setInterval(function () {
    var now = (new Date()).getTime(),
        idleActivityThreshold = now - (60 * 1000), // 60 sec
        deadActivityThreshold = now - (10 * 60 * 1000), // 10 mins
        deadHeartbeatThreshold = now - (5 * 1000); // 5 sec

    Lives.update({ lastActivity: { $lt: idleActivityThreshold } }, { $set: { idle: true } }, { multi: true });
    Lives.remove({ lastActivity: { $lt: deadActivityThreshold } });
    Lives.remove({ lastHeartbeat: { $lt: deadHeartbeatThreshold } });
  }, 5000);

  // Cleanup anything stale, once a day
  Meteor.setInterval(function() {
    Lives.remove({});
  }, 24 * 60 * 60 * 1000);
});

Meteor.methods({
  sendLifeHeartbeat: function(topic, key) {
    Lives.update({ topic: topic, key: key }, { $set: { lastHeartbeat: (new Date()).getTime() } }, { upsert: true });
  },
  sendLifeActivity: function(topic, key) {
    Lives.update({ topic: topic, key: key }, { $set: { lastActivity: (new Date()).getTime(), idle: false } }, { upsert: true });
  }
});