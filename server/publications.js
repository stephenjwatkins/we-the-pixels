Meteor.publish("pixels-by-canvas", function(canvasId) {
	return CurrentPaints.find({ canvasId: canvasId });
});

Meteor.publish("canvases", function() {
	return Canvases.find({}, {
          fields: { canvasId: 1, owner: 1, subject: 1, rows: 1, cols: 1, createdAt: 1 },
          sort: { createdAt: -1 },
          limit: 21
        });
});

Meteor.publish("home-gallery-canvases", function() {
  return Canvases.find({}, {
    fields: { canvasId: 1, lastSave: 1, lastPaint: 1, createdAt: 1 },
    sort: { createdAt: -1 },
    limit: 6
  });
});

Meteor.publish("canvas", function(canvasId) {
  return Canvases.find({ canvasId: canvasId }, {
    fields: { canvasId: 1, owner: 1, subject: 1, rows: 1, cols: 1, createdAt: 1 }
  });
});

Meteor.publish("userData", function () {
  return Meteor.users.find({ _id: this.userId });
});

Meteor.publish("lives", function(topic) {
  return Lives.find({ topic: topic }, { fields: { topic: 1, key: 1, idle: 1 } });
});

Meteor.publish("latest-featured-paint", function() {
  return AllPaints.find({}, {
          fields: { canvasId: 1, color: 1 },
          sort: { date: -1 },
          limit: 1
        });
});