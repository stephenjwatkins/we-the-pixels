// Npm.require('mailchimp').MailChimpAPI;
var MailChimpAPI = function() {};

try {
  var api = new MailChimpAPI(Meteor.settings.mailchimp.apiKey, {
    version: "1.3",
    secure: false
  });
} catch (error) {
  console.log(error.message);
}

WTPMail = {
  subscribeUserToNews: function(user) {
    var mergeVars = {
      GROUPINGS: [
        {
          name: "Notify me about:",
          groups: "New Features"
        }
      ],
      FNAME: user.username
    };

    api.listSubscribe(
      {
        id: Meteor.settings.mailchimp.listId,
        email_address: user.emails[0].address,
        merge_vars: mergeVars,
        email_type: "html",
        double_optin: false,
        update_existing: true,
        send_welcome: false
      },
      function(error, data) {
        if (!error) {
          console.log(data);
        } else {
          console.log(error);
        }
      }
    );
  }
};
