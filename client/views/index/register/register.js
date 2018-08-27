Template.index.events({
  'submit .register-form': function(e) {
    e.preventDefault();

    var $this = $(e.currentTarget),
        $username = $('[name="username_register"]', $this),
        $email = $('[name="email_register"]', $this),
        $password = $('[name="password_register"]', $this),
        $button = $('button[type="submit"]', $this),
        $mainError = $this.closest('.dialog').find('.main-error'),
        originalButtonText = $button.text();

    if (!$this.parsley('validate')) {
      return;
    }

    $mainError.text('');
    $button.addClass('loading').prop('disabled', true).text($button.data('loading-text'));

    Accounts.createUser({
      username: $.trim($username.val()),
      email: $.trim($email.val()),
      password: $.trim($password.val()),
      profile: {
        subscribed: true,
        suspended: false
      }
    }, function(err) {
      $button.removeClass('loading').prop('disabled', false).text(originalButtonText);
      if (err) {
        $mainError.text(err.reason);
        return;
      }
      Meteor.logout(function() {
        Session.set('flash', 'Almost there! Check your inbox for instructions on verifying your email.');
        Backbone.history.navigate('/', true);
      });
    });
  }
});