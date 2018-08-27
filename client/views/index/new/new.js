Template.index.events({
  'submit .new-form': function(e, T) {
    e.preventDefault();

    var $this = $(e.currentTarget),
        $subject = $('[name="subject_new"]', $this),
        $button = $('button[type="submit"]', $this),
        $mainError = $this.closest('.dialog').find('.main-error'),
        subjectTitle = $.trim($subject.val()),
        originalButtonText = $button.text();

    if (!$this.parsley('validate')) {
      return;
    }

    $mainError.text('');
    $button.addClass('loading').prop('disabled', true).text($button.data('loading-text'));

    if (!Meteor.user()) {
      $mainError.text('Sorry, creating a canvas can only be done by users. <a href="/account/register">Create an account!</a>');
      return;
    }

    var rows = 45,
        cols = 80;

    Meteor.call('createCanvas', Meteor.userId(), subjectTitle, rows, cols, function(err, id) {
      if (err) {
        $button.removeClass('loading').prop('disabled', false).text(originalButtonText);
        $mainError.text(err.reason);
        return;
      }
      Backbone.history.navigate('/canvas/' + id, true);
    });
  }
});