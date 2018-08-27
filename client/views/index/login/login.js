Template.index.events({
  'submit .login-form': function(e) {
    e.preventDefault();

    var $this = $(e.currentTarget),
        $username = $('[name="username_login"]', $this),
        $password = $('[name="password_login"]', $this),
        $button = $('button[type="submit"]', $this),
        $mainError = $this.closest('.dialog').find('.main-error'),
        originalButtonText = $button.text();

    if (!$this.parsley('validate')) {
      return;
    }

    $mainError.text('');
    $button.addClass('loading').prop('disabled', true).text($button.data('loading-text'));

    var $this = $(e.currentTarget);
    Meteor.loginWithPassword(
      $.trim($username.val()),
      $.trim($password.val()),
      function(err) {
        $button.removeClass('loading').prop('disabled', false).text(originalButtonText);

        if (err && (err.reason == 'User has no password set')) {
          $mainError.html('For security purposes, we\'ve recently updated our user account system.<br />As a result, your password needs to be reset.<br /><a href="/account/forgot" class="traditional-link" rel="transition-content">Reset your password.</a>');
          return;
        } else if (err) {
          $mainError.text(err.reason);
        }

        if (!Meteor.user().emails[0].verified) {
          Meteor.logout(function() {
            $mainError.text('Email verification required. Check your inbox for verification instructions.');
          });
          return;
        }

        Session.set('flash', 'Welcome!');
        Backbone.history.navigate('/', true);
      }
    );
  }
});