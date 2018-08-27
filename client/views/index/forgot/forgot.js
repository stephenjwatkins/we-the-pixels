Template.index.events({
  'submit .forgot-form': function(e) {
    e.preventDefault();

    var $this = $(e.currentTarget),
        $email = $('[name="email_forgot"]', $this),
        $button = $('button[type="submit"]', $this),
        $mainError = $this.closest('.dialog').find('.main-error'),
        originalButtonText = $button.text();

    if (!$this.parsley('validate')) {
      return;
    }

    $mainError.text('');
    $button.addClass('loading').prop('disabled', true).text($button.data('loading-text'));

    Accounts.forgotPassword({
      email: $.trim($email.val())
    }, function(err) {
      $button.removeClass('loading').prop('disabled', false).text(originalButtonText);
      if (err) {
        $mainError.text(err.reason);
        return;
      }
      Session.set('flash', 'Check your inbox for instructions on resetting your password.');
      Backbone.history.navigate('/', true);
    });
  }
});