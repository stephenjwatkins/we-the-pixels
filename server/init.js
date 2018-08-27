/**
 * Setup accounts.
 */
Accounts.config({
  sendVerificationEmail: true
});

Accounts.emailTemplates.siteName = "We the Pixels";
Accounts.emailTemplates.from = "We the Pixels <support@wethepixels.com>";

// Verification email properties
Accounts.emailTemplates.verifyEmail.subject = function (user) { return "Email Verification"; };
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
  var token = url.substring(url.lastIndexOf('/') + 1),
      url = Meteor.absoluteUrl('account/verify/') + token;

  return "Congratulations on becoming an artist!\n\n"
    + "Verify your email by visiting the link below:\n\n"
    + url;
};

// Reset password properties
Accounts.emailTemplates.resetPassword.subject = function (user) { return "Password Reset"; };
Accounts.emailTemplates.resetPassword.text = function (user, url) {
  var token = url.substring(url.lastIndexOf('/') + 1),
      url = Meteor.absoluteUrl('account/reset/') + token;

  return "Reset your password by visiting the link below:\n\n" + url;
};

// Enroll Account properties
Accounts.emailTemplates.enrollAccount.subject = function (user) { return "Security Upgrade"; };
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
  var token = url.substring(url.lastIndexOf('/') + 1),
      url = Meteor.absoluteUrl('account/reset/') + token;

  return user.username + "," +
         "\n\nWe the Pixels has gotten a huge update! One aspect of this update was our security. " +
         "We are automatically upgrading all our users to more secure accounts. " +
         "Don't worry, our servers were not hacked; we just care about security. " +
         "In order for this upgrade to take effect on your account, we need you to create a " +
         "new password.\n\nSet your new password by visiting the link below:\n\n" + url +
         "\n\nNote: Your old password will no longer be accepted.";
};

process.env.MAIL_URL = "smtp://support%40wethepixels.com:bloojooisbloojoo@smtp.gmail.com:465/";

// Let us know in the logs that we've begun
Meteor.startup(function() {
  console.log("WTP has started.");

  // Initialize the Counter var for 'canvas'
  if (Counter.find({ _id: 'canvas' }).count() === 0) {
    console.log("Canvas counter does not exist. Initializing...");
    Counter.insert({
      _id: "canvas",
      seq: 0
    });
    console.log("Canvas counter initialized.");
  }
});