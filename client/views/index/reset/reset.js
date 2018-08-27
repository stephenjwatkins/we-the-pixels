Template.index.events({
  'submit .reset-form': function(e) {
    e.preventDefault();

    var $this = $(e.currentTarget),
        $newPassword = $('[name="new_password_reset"]', $this),
        $button = $('button[type="submit"]', $this),
        $mainError = $this.closest('.dialog').find('.main-error'),
        token = Session.get('resetToken'),
        originalButtonText = $button.text();

    if (!$this.parsley('validate')) {
      return;
    }

    $mainError.text('');
    $button.addClass('loading').prop('disabled', true).text($button.data('loading-text'));

    Accounts.resetPassword(token, $newPassword.val(), function(err) {
      $button.removeClass('loading').prop('disabled', false).text(originalButtonText);
      if (err) {
        $mainError.text(err.reason);
        return;
      }
      Session.set('flash', 'Password changed successfully.');
      Backbone.history.navigate('/', true);
    });

  }
});