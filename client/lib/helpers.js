Handlebars.registerHelper('isValidUser',function() {
  return Meteor.user() && Meteor.user().emails[0].verified;
});