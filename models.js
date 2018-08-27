Counter = new Meteor.Collection("counter");
Canvases = new Meteor.Collection("canvases");

// Top-most layer of pixels for each canvas (no history)
CurrentPaints = new Meteor.Collection("currentPaints");

// Paint history for each canvas
AllPaints = new Meteor.Collection("allPaints");

// For keeping track of users subscribed to connections
Lives = new Meteor.Collection("lives");