Template.indexContent.indexSectionHome = function () { return Session.equals('indexSection', 'home'); };
Template.indexContent.indexSectionLogin = function () { return Session.equals('indexSection', 'account/login'); };
Template.indexContent.indexSectionRegister = function () { return Session.equals('indexSection', 'account/register'); };
Template.indexContent.indexSectionNewCanvas = function () { return Session.equals('indexSection', 'new'); };
Template.indexContent.indexSectionForgot = function () { return Session.equals('indexSection', 'account/forgot'); };
Template.indexContent.indexSectionReset = function () { return Session.equals('indexSection', 'account/reset'); };

Template.indexContent.rendered = function() {

  // If home page, fade out header logo. otherwise, fade it in
  var inOrOut = Session.equals('indexSection', 'home') ? 'fadeOut' : 'fadeIn';
  $('.header-logo')[inOrOut]();

  // Fade in the content area
  $('.content').css('opacity', 0).animate({
    opacity: 1
  }, 150);

  // Initialize parsley (destroying any previously initialized forms)
  var $form = $('form');
  if ($form.length) {
    $form.parsley('destroy').parsley({
      errors: {
        classHandler: function (elem, isRadioOrCheckbox) {
          return $(elem).parent();
        }
      },
      listeners: {
        onFieldError: function (elem, constraints, ParsleyField) {
          $('.parsley-error-list').each(function() {
            $(this).css({
              right: -($(this).outerWidth() + 16),
              'margin-top': -($(this).outerHeight() / 2)
            });
          });
        }
      }
    });
  }

};